from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import models

# --- DATABASE SETUP (SQLite) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./farm_market.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farmer to Consumer API")

# --- AUTH SETUP (JWT & Bcrypt) ---
SECRET_KEY = "my_super_secret_key_for_prototype_only"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str # 'farmer' or 'consumer'
    email: str = None
    phone: str = None
    address: str = None
    dob: str = None
    profile_picture_url: str = None

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    image_url: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- AUTH ROUTES ---
@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    if user.role not in ['farmer', 'consumer']:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(
        username=user.username, 
        hashed_password=hashed_pw, 
        role=user.role,
        email=user.email,
        phone=user.phone,
        address=user.address,
        dob=user.dob,
        profile_picture_url=user.profile_picture_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username, "role": new_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_role(role: str):
    def role_checker(current_user: models.User = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(status_code=403, detail=f"Require {role} privileges")
        return current_user
    return role_checker

# --- CRUD ROUTES ---
@app.get("/api/products")
def get_all_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.post("/api/products")
def create_product(product: ProductCreate, 
                   db: Session = Depends(get_db), 
                   current_user: models.User = Depends(require_role("farmer"))):
    new_product = models.Product(**product.dict(), farmer_id=current_user.id)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, 
                   db: Session = Depends(get_db),
                   current_user: models.User = Depends(require_role("farmer"))):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# --- STATIC FILES (For serving frontend) ---
from fastapi.staticfiles import StaticFiles

# Serve all files in the current directory at the root URL
app.mount("/", StaticFiles(directory=".", html=True), name="static")
