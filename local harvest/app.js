document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle removed per new dark theme design

    // --- State & Mock Data (acting as API integration point) ---
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    function saveState() {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('products', JSON.stringify(products));
    }

    let currentUser = null; // { role: 'farmer' | 'consumer', username: string, phone: string, cart: [] }
    const defaultProducts = [
        // Fruits & Vegetables
        { id: 1, category: 'fruits', name: 'Heirloom Tomatoes', desc: 'Fresh organic tomatoes.', price: 60, qty: 20, unit: 'kg', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80', farmerId: 'Sunset Farms' },
        { id: 2, category: 'fruits', name: 'Crisp Apples', desc: 'Sweet and crunchy Gala apples.', price: 125, qty: 50, unit: 'kg', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=300&q=80', farmerId: 'Orchard Valley' },
        { id: 3, category: 'fruits', name: 'Organic Carrots', desc: 'Earthy, sweet, and freshly harvested.', price: 40, qty: 100, unit: 'kg', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80', farmerId: 'Green Roots' },
        { id: 4, category: 'fruits', name: 'Yellow Bananas', desc: 'Perfectly ripe bananas.', price: 30, qty: 80, unit: 'piece', img: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=300&q=80', farmerId: 'Tropical Greens' },
        { id: 5, category: 'fruits', name: 'Bell Peppers', desc: 'Assorted colors, great for salads.', price: 75, qty: 30, unit: 'piece', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=300&q=80', farmerId: 'Sunset Farms' },
        
        // Grains & Pulses
        { id: 26, category: 'grains', name: 'Basmati Rice', desc: 'Long grain, aromatic basmati rice from local paddies.', price: 90, qty: 100, unit: 'kg', img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=300&q=80', farmerId: 'Golden Fields' },
        { id: 27, category: 'grains', name: 'Whole Wheat (Gehu)', desc: 'Unpolished premium wheat grains.', price: 35, qty: 200, unit: 'kg', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80', farmerId: 'Kisan Aggregators' },
        { id: 28, category: 'grains', name: 'Yellow Toor Dal', desc: 'Unpolished pigeon pea lentils.', price: 120, qty: 50, unit: 'kg', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=300&q=80', farmerId: 'Valley Farms' },
        { id: 29, category: 'grains', name: 'Organic Chickpeas (Chana)', desc: 'High-protein whole chickpeas.', price: 95, qty: 80, unit: 'kg', img: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=300&q=80', farmerId: 'Valley Farms' },
        
        // Dairy & Eggs
        { id: 30, category: 'dairy', name: 'A2 Gir Cow Milk', desc: 'Freshly milked A2 raw milk. Unpasteurized.', price: 95, qty: 40, unit: 'piece', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80', farmerId: 'Local Dairy Farm' },
        { id: 31, category: 'dairy', name: 'Organic Free-Range Eggs', desc: 'Dozen brown eggs from pasture-raised hens.', price: 250, qty: 30, unit: 'piece', img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=300&q=80', farmerId: 'Sunrise Egg Farm' },
        { id: 32, category: 'dairy', name: 'Fresh Paneer', desc: 'Homemade cottage cheese block (500g).', price: 180, qty: 15, unit: 'piece', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946cea?auto=format&fit=crop&w=300&q=80', farmerId: 'Local Dairy Farm' },
        { id: 33, category: 'dairy', name: 'Desi Ghee', desc: 'Pure clarified butter from A2 milk (1 Liter).', price: 850, qty: 10, unit: 'piece', img: 'https://images.unsplash.com/photo-1634826500595-3bcdd8069519?auto=format&fit=crop&w=300&q=80', farmerId: 'Local Dairy Farm' },

        // Herbs & Spices
        { id: 34, category: 'spices', name: 'Turmeric Root (Haldi)', desc: 'Raw, fresh organic turmeric rhizomes.', price: 80, qty: 25, unit: 'kg', img: 'https://images.unsplash.com/photo-1615485925600-97237c4fa1ed?auto=format&fit=crop&w=300&q=80', farmerId: 'Spice Grove' },
        { id: 35, category: 'spices', name: 'Fresh Cilantro (Dhania)', desc: 'Aromatic coriander leaves.', price: 15, qty: 40, unit: 'piece', img: 'https://images.unsplash.com/photo-1581454173873-1cd5ddb01511?auto=format&fit=crop&w=300&q=80', farmerId: 'Green Roots' },
        { id: 36, category: 'spices', name: 'Red Chilli Powder', desc: 'Sun-dried and stone-ground hot chilli.', price: 350, qty: 20, unit: 'kg', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', farmerId: 'Spice Grove' },
        { id: 37, category: 'spices', name: 'Whole Cumin Seeds (Jeera)', desc: 'Aromatic local cumin seeds.', price: 450, qty: 15, unit: 'kg', img: 'https://images.unsplash.com/photo-1599909618037-d1a2fc7c6a6f?auto=format&fit=crop&w=300&q=80', farmerId: 'Spice Grove' },

        // Meat & Poultry
        { id: 38, category: 'meat', name: 'Fresh Free-Range Chicken', desc: 'Whole dressed country chicken.', price: 320, qty: 25, unit: 'kg', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80', farmerId: 'Mala Farms' },
        { id: 39, category: 'meat', name: 'Premium Goat Meat (Mutton)', desc: 'Grass-fed goat meat, curry cut.', price: 850, qty: 15, unit: 'kg', img: 'https://images.unsplash.com/photo-1602414345330-8199738f615b?auto=format&fit=crop&w=300&q=80', farmerId: 'Mala Farms' },
        { id: 40, category: 'meat', name: 'Fresh Water Fish (Rohu)', desc: 'Locally caught fresh pond fish.', price: 250, qty: 30, unit: 'kg', img: 'https://images.unsplash.com/photo-1517427294546-5aa121f68b82?auto=format&fit=crop&w=300&q=80', farmerId: 'River Catch' }
    ];
    let products = JSON.parse(localStorage.getItem('products'));
    // If they added products (length > default), wipe it back to default
    if (products && products.length > defaultProducts.length) {
        products = [...defaultProducts];
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        products = products || [...defaultProducts];
    }
    
    let cart = [];

    // --- Elements ---
    const marketingPage = document.getElementById('marketing-page');
    const showMarketplaceBtn = document.getElementById('show-marketplace-btn');
    const authSection = document.getElementById('auth-section');
    const authFormBottomSheet = document.getElementById('auth-form-bottomsheet');
    const mobileInput = document.getElementById('mobile-number-input');
    const continueLoginBtn = document.getElementById('continue-login-btn');
    const skipLoginBtn = document.getElementById('skip-login-btn');
    
    const farmerDashboard = document.getElementById('farmer-dashboard');
    const consumerDashboard = document.getElementById('consumer-dashboard');
    const navLogout = document.getElementById('nav-logout');
    const navProfile = document.getElementById('nav-profile');
    const profileSection = document.getElementById('profile-section');
    const updateProfileDetailsForm = document.getElementById('update-profile-details-form');

    // --- Marketing to Auth Transition ---
    let loginTimer;
    function showAuth() {
        marketingPage.classList.remove('active-section');
        marketingPage.classList.add('hidden');
        authSection.classList.remove('hidden');
        authSection.classList.add('active-section');
    }

    // Auto-show login after 1 minute (60000 ms) - Removed since Login is now default
    // loginTimer = setTimeout(showAuth, 60000);

    const navLoginBtn = document.getElementById('nav-login-btn');
    const navCartBtn = document.getElementById('nav-cart-btn');
    const navCartCount = document.getElementById('nav-cart-count');

    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', () => {
            clearTimeout(loginTimer);
            showAuth();
        });
    }

    if (navCartBtn) {
        navCartBtn.addEventListener('click', () => {
            const cartCard = document.querySelector('.cart-card');
            if (cartCard) {
                cartCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    navLogout.addEventListener('click', () => {
        location.reload();
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = themeToggleBtn.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // Global Home Button
    const navHomeBtn = document.getElementById('nav-home-btn');
    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', () => {
            // Only allow going home if logged in, otherwise showAuth()
            if (!currentUser) {
                clearTimeout(loginTimer);
                showAuth();
                return;
            }

            // Hide all pages
            authSection.classList.add('hidden');
            authSection.classList.remove('active-section');
            farmerDashboard.classList.add('hidden');
            consumerDashboard.classList.add('hidden');
            profileSection.classList.add('hidden');
            document.getElementById('product-detail-section').classList.add('hidden');
            document.getElementById('ad-detail-section').classList.add('hidden');

            // Show marketing page
            marketingPage.classList.remove('hidden');
            marketingPage.classList.add('active-section');
            window.scrollTo(0,0);
        });
    }

    // Go to marketplace from marketing page
    if (showMarketplaceBtn) {
        showMarketplaceBtn.addEventListener('click', () => {
            marketingPage.classList.remove('active-section');
            marketingPage.classList.add('hidden');
            profileSection.classList.add('hidden');
            if (currentUser && currentUser.role === 'farmer') {
                farmerDashboard.classList.remove('hidden');
                renderFarmerListings();
            } else {
                consumerDashboard.classList.remove('hidden');
                renderMarketplace(); // renders all
            }
            window.scrollTo(0,0);
        });
    }

    window.openCategory = (categoryName) => {
        if (!currentUser) {
            clearTimeout(loginTimer);
            showAuth();
            return;
        }
        marketingPage.classList.remove('active-section');
        marketingPage.classList.add('hidden');
        profileSection.classList.add('hidden');
        if (currentUser.role === 'farmer') {
            farmerDashboard.classList.remove('hidden');
            renderFarmerListings();
            window.openFarmerForm(categoryName);
        } else {
            consumerDashboard.classList.remove('hidden');
            renderMarketplace(categoryName);
        }
        window.scrollTo(0,0);
    };

    // --- Bottom Sheet Auth Logic ---
    if (skipLoginBtn) {
        skipLoginBtn.addEventListener('click', () => {
            authSection.classList.remove('active-section');
            authSection.classList.add('hidden');
            marketingPage.classList.remove('hidden');
            marketingPage.classList.add('active-section');
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
            if (e.target.value.length === 10) {
                continueLoginBtn.classList.remove('disabled');
                continueLoginBtn.removeAttribute('disabled');
            } else {
                continueLoginBtn.classList.add('disabled');
                continueLoginBtn.setAttribute('disabled', 'true');
            }
        });
    }
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        // Trigger reflow to ensure transition works
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showRoleSelectionModal(phone, accounts) {
        // Create 3D colored modal
        const modalOverlay = document.createElement('div');
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100vw';
        modalOverlay.style.height = '100vh';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        modalOverlay.style.backdropFilter = 'blur(5px)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '10000';

        const modalBox = document.createElement('div');
        // 3D styled box with rounded corners
        modalBox.style.background = 'linear-gradient(145deg, #2b2b36, #1f1f27)';
        modalBox.style.boxShadow = '15px 15px 30px #131318, -15px -15px 30px #3f3f4e, inset 2px 2px 5px rgba(255,255,255,0.1)';
        modalBox.style.borderRadius = '20px';
        modalBox.style.padding = '2.5rem';
        modalBox.style.width = '90%';
        modalBox.style.maxWidth = '400px';
        modalBox.style.textAlign = 'center';
        modalBox.style.color = '#fff';

        const title = document.createElement('h3');
        title.innerText = 'Select Login Role';
        title.style.marginBottom = '2rem';
        title.style.fontSize = '1.5rem';
        title.style.fontWeight = '700';
        title.style.color = '#f97316';
        modalBox.appendChild(title);

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'column';
        btnContainer.style.gap = '1rem';

        const farmerBtn = document.createElement('button');
        farmerBtn.innerText = 'Login as Farmer';
        farmerBtn.style.padding = '1rem';
        farmerBtn.style.borderRadius = '12px';
        farmerBtn.style.border = 'none';
        farmerBtn.style.background = 'linear-gradient(145deg, #10b981, #059669)';
        farmerBtn.style.boxShadow = '5px 5px 10px #035239, -2px -2px 5px #24ffb8';
        farmerBtn.style.color = 'white';
        farmerBtn.style.fontWeight = 'bold';
        farmerBtn.style.fontSize = '1.1rem';
        farmerBtn.style.cursor = 'pointer';
        farmerBtn.onclick = () => {
            handleRoleSelection(phone, 'farmer', accounts, modalOverlay);
        };
        btnContainer.appendChild(farmerBtn);

        const consumerBtn = document.createElement('button');
        consumerBtn.innerText = 'Login as Consumer';
        consumerBtn.style.padding = '1rem';
        consumerBtn.style.borderRadius = '12px';
        consumerBtn.style.border = 'none';
        consumerBtn.style.background = 'linear-gradient(145deg, #f97316, #ea580c)';
        consumerBtn.style.boxShadow = '5px 5px 10px #823006, -2px -2px 5px #ffb452';
        consumerBtn.style.color = 'white';
        consumerBtn.style.fontWeight = 'bold';
        consumerBtn.style.fontSize = '1.1rem';
        consumerBtn.style.cursor = 'pointer';
        consumerBtn.onclick = () => {
            handleRoleSelection(phone, 'consumer', accounts, modalOverlay);
        };
        btnContainer.appendChild(consumerBtn);

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.style.padding = '0.8rem';
        cancelBtn.style.marginTop = '1rem';
        cancelBtn.style.borderRadius = '12px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.color = '#a1a1aa';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.onclick = () => document.body.removeChild(modalOverlay);
        btnContainer.appendChild(cancelBtn);

        modalBox.appendChild(btnContainer);
        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);
    }

    function handleRoleSelection(phone, role, accounts, modalOverlay) {
        let user = accounts.find(u => u.role === role);
        if (!user) {
            showToast(`No ${role} account found for this number. Please sign up first.`);
        } else {
            document.body.removeChild(modalOverlay);
            handleLoginSuccess(user);
        }
    }

    if (authFormBottomSheet) {
        authFormBottomSheet.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = mobileInput.value;
            
            let userAccounts = registeredUsers.filter(u => u.phone === phone);
            if (userAccounts.length === 0) {
                showToast("No account found with this number. Please sign up first.");
                return;
            }
            
            showRoleSelectionModal(phone, userAccounts);
        });
    }

    const authFormRegister = document.getElementById('auth-form-register');
    const mobileRegisterInput = document.getElementById('mobile-register-input');
    if (authFormRegister) {
        authFormRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = mobileRegisterInput.value;
            const role = document.querySelector('input[name="role_reg"]:checked').value;
            
            let user = registeredUsers.find(u => u.phone === phone && u.role === role);
            if (user) {
                showToast(`A ${role} account is already created with this number. Please login.`);
                return;
            }
            
            user = { username: 'User_' + phone.slice(-4), password: 'pwd', role, phone, cart: [] };
            registeredUsers.push(user);
            saveState();
            handleLoginSuccess(user);
        });
    }

    function updateNavbarAvatar() {
        const navImg = document.getElementById('nav-profile-img');
        const navIcon = document.getElementById('nav-profile-icon');
        if (currentUser && currentUser.profile_picture_url) {
            navImg.src = currentUser.profile_picture_url;
            navImg.style.display = 'block';
            navIcon.style.display = 'none';
        } else {
            navImg.style.display = 'none';
            navIcon.style.display = 'block';
        }
    }

    function updateMarketingCTA() {
        const orderBtns = document.querySelectorAll('.order-now-btn');
        const shopBtn = document.getElementById('show-marketplace-btn');
        const catHeading = document.getElementById('category-nav-heading');
        
        if (currentUser && currentUser.role === 'farmer') {
            orderBtns.forEach(btn => btn.textContent = 'List Item');
            if (shopBtn) shopBtn.textContent = 'List Now';
            if (catHeading) catHeading.textContent = 'List by Category';
        } else {
            orderBtns.forEach(btn => btn.textContent = 'Order Now');
            if (shopBtn) shopBtn.textContent = 'Shop Now';
            if (catHeading) catHeading.textContent = 'Browse by Category';
        }
    }

    function handleLoginSuccess(userObj) {
        currentUser = userObj;
        cart = currentUser.cart || [];
        renderCart(); // Reflect their existing cart immediately
        
        clearTimeout(loginTimer);
        
        authSection.classList.remove('active-section');
        authSection.classList.add('hidden');
        
        navLogout.classList.remove('hidden');
        navProfile.classList.remove('hidden');
        if(document.getElementById('nav-login-btn')) {
            document.getElementById('nav-login-btn').classList.add('hidden');
        }
        
        updateNavbarAvatar();
        updateMarketingCTA();

        // After login, show marketing page first instead of consumer dashboard
        marketingPage.classList.remove('hidden');
        marketingPage.classList.add('active-section');
    }

    document.getElementById('btn-back-from-profile').addEventListener('click', () => {
        profileSection.classList.add('hidden');
        if (currentUser.role === 'farmer') {
            farmerDashboard.classList.remove('hidden');
            renderFarmerListings();
        } else {
            consumerDashboard.classList.remove('hidden');
            renderMarketplace();
        }
    });

    document.getElementById('btn-profile-dashboard').addEventListener('click', () => {
        document.getElementById('btn-back-from-profile').click();
    });

    document.getElementById('btn-profile-settings').addEventListener('click', () => {
        alert("Settings Module:\nHere you will be able to change your password, update notification preferences, and manage payment methods.");
    });

    document.getElementById('btn-profile-contact').addEventListener('click', () => {
        alert("Contact Support:\nEmail: support@farmertoconsumer.com\nPhone: +91 9876543210\nHours: 9 AM - 6 PM (Mon-Sat)");
    });

    document.getElementById('btn-profile-privacy').addEventListener('click', () => {
        alert("Privacy Policy:\nWe only store your email and phone locally in your browser session for this prototype. No data is shared with third parties. Your data is encrypted in transit.");
    });

    navProfile.addEventListener('click', () => {
        marketingPage.classList.remove('active-section');
        marketingPage.classList.add('hidden');
        authSection.classList.add('hidden');
        farmerDashboard.classList.add('hidden');
        consumerDashboard.classList.add('hidden');
        profileSection.classList.remove('hidden');
        
        document.getElementById('display-username').textContent = currentUser.username;
        document.getElementById('display-role').textContent = currentUser.role;
        
        // Pre-fill edit form
        document.getElementById('edit-fullname').value = currentUser.fullname || '';
        document.getElementById('edit-username').value = currentUser.username || '';
        document.getElementById('edit-email').value = currentUser.email || '';
        document.getElementById('edit-phone').value = currentUser.phone || '';
        document.getElementById('edit-dob').value = currentUser.dob || '';
        document.getElementById('edit-profile-pic-url').value = currentUser.profile_picture_url || '';
        
        if (currentUser.profile_picture_url) {
            document.getElementById('display-profile-pic').src = currentUser.profile_picture_url;
        }
    });

    // Live preview for profile picture
    const fileInput = document.getElementById('edit-profile-pic-file');
    const urlInput = document.getElementById('edit-profile-pic-url');
    const displayPic = document.getElementById('display-profile-pic');

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                displayPic.src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    urlInput.addEventListener('input', () => {
        if (urlInput.value && (!fileInput.files || fileInput.files.length === 0)) {
            displayPic.src = urlInput.value;
        }
    });

    updateProfileDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update state
        currentUser.fullname = document.getElementById('edit-fullname').value;
        currentUser.username = document.getElementById('edit-username').value;
        currentUser.email = document.getElementById('edit-email').value;
        currentUser.phone = document.getElementById('edit-phone').value;
        currentUser.dob = document.getElementById('edit-dob').value;
        
        // Update local arrays based on the current user
        let userInArray = registeredUsers.find(u => u.phone === currentUser.phone && u.role === currentUser.role);
        if (userInArray) {
            userInArray.fullname = currentUser.fullname;
            userInArray.username = currentUser.username;
            userInArray.email = currentUser.email;
            userInArray.phone = currentUser.phone;
            userInArray.dob = currentUser.dob;
        }

        const fileInput = document.getElementById('edit-profile-pic-file');
        const urlInput = document.getElementById('edit-profile-pic-url');
        
        const saveAndAlert = () => {
            document.getElementById('display-username').textContent = currentUser.username;
            if (userInArray) userInArray.profile_picture_url = currentUser.profile_picture_url;
            updateNavbarAvatar();
            saveState();
            showToast("Profile details updated successfully!");
        };
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentUser.profile_picture_url = e.target.result;
                document.getElementById('display-profile-pic').src = currentUser.profile_picture_url;
                saveAndAlert();
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            if (urlInput.value) {
                currentUser.profile_picture_url = urlInput.value;
            }
            if (currentUser.profile_picture_url) {
                document.getElementById('display-profile-pic').src = currentUser.profile_picture_url;
            }
            saveAndAlert();
        }
    });



    // --- Farmer Logic ---
    const addProduceForm = document.getElementById('add-produce-form');
    const farmerListings = document.getElementById('farmer-listings');

    window.openFarmerForm = (category) => {
        document.getElementById('farmer-category-selection').classList.add('hidden');
        document.getElementById('farmer-add-section').classList.remove('hidden');
        document.getElementById('prod-category').value = category;
        
        let displayCat = category;
        if (category === 'fruits') displayCat = 'Fruits & Vegetables';
        if (category === 'dairy') displayCat = 'Dairy';
        if (category === 'grains') displayCat = 'Grains & Pulses';
        if (category === 'spices') displayCat = 'Herbs & Spices';
        if (category === 'meat') displayCat = 'Meat & Poultry';
        document.getElementById('farmer-form-title').textContent = 'Add New ' + displayCat;
    };

    window.closeFarmerForm = () => {
        document.getElementById('farmer-add-section').classList.add('hidden');
        if (!window.isAdminMode) {
            document.getElementById('farmer-category-selection').classList.remove('hidden');
        }
    };

    const prodImgFile = document.getElementById('prod-img-file');
    const prodImgPreviewContainer = document.getElementById('prod-img-preview-container');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    let currentUploadImages = [];

    const updatePreviewUI = () => {
        if (currentUploadImages.length > 0) {
            prodImgPreviewContainer.innerHTML = currentUploadImages.map(src => `<img src="${src}" class="preview-thumbnail">`).join('');
            prodImgPreviewContainer.style.display = 'flex';
            if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
        } else {
            prodImgPreviewContainer.innerHTML = '';
            prodImgPreviewContainer.style.display = 'none';
            if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        }
    };

    if (prodImgFile) {
        prodImgFile.addEventListener('change', async () => {
            if (prodImgFile.files && prodImgFile.files.length > 0) {
                const files = Array.from(prodImgFile.files).slice(0, 4); // Max 4
                if (prodImgFile.files.length > 4) {
                    showToast("Only first 4 images selected will be uploaded.");
                }
                currentUploadImages = await Promise.all(files.map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = e => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    });
                }));
                updatePreviewUI();
            } else {
                currentUploadImages = [];
                updatePreviewUI();
            }
        });
    }

    let editingProductId = null;

    window.editProduct = (id) => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;
        editingProductId = id;
        document.getElementById('farmer-form-title').innerText = "Edit Item";
        
        document.getElementById('prod-category').value = prod.category || '';
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-desc').value = prod.desc;
        document.getElementById('prod-qty').value = prod.qty;
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-harvest-date').value = prod.harvestDate || '';
        document.getElementById('prod-unit').value = prod.unit;
        
        if (prod.images && prod.images.length > 0) {
            currentUploadImages = [...prod.images];
        } else if (prod.img) {
            currentUploadImages = [prod.img];
        } else {
            currentUploadImages = [];
        }
        updatePreviewUI();

        if (currentUploadImages.length > 0) {
            prodImgFile.removeAttribute('required');
        } else {
            prodImgFile.setAttribute('required', 'true');
        }
        
        document.getElementById('farmer-category-selection').classList.add('hidden');
        document.getElementById('farmer-add-section').classList.remove('hidden');
        window.scrollTo(0, 0);
    };

    // Override openFarmerForm to reset edit mode when adding new
    const originalOpenFarmerForm = window.openFarmerForm;
    window.openFarmerForm = (category) => {
        editingProductId = null;
        prodImgFile.setAttribute('required', 'true');
        addProduceForm.reset();
        currentUploadImages = [];
        updatePreviewUI();
        originalOpenFarmerForm(category);
    };

    addProduceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (currentUploadImages.length === 0 && !editingProductId) {
            showToast("Please select at least one image to upload.");
            return;
        }

        const saveProductData = () => {
            if (editingProductId) {
                // Update existing
                const prod = products.find(p => p.id === editingProductId);
                if (prod) {
                    prod.category = document.getElementById('prod-category').value;
                    prod.name = document.getElementById('prod-name').value;
                    prod.desc = document.getElementById('prod-desc').value;
                    prod.price = parseFloat(document.getElementById('prod-price').value);
                    prod.qty = parseInt(document.getElementById('prod-qty').value);
                    prod.unit = document.getElementById('prod-unit').value;
                    prod.harvestDate = document.getElementById('prod-harvest-date').value;
                    if (currentUploadImages.length > 0) {
                        prod.images = [...currentUploadImages];
                        prod.img = currentUploadImages[0];
                    }
                }
                showToast("Product updated successfully!");
            } else {
                // Add new
                const newProduct = {
                    id: Date.now(),
                    category: document.getElementById('prod-category').value,
                    name: document.getElementById('prod-name').value,
                    desc: document.getElementById('prod-desc').value,
                    price: parseFloat(document.getElementById('prod-price').value),
                    qty: parseInt(document.getElementById('prod-qty').value),
                    unit: document.getElementById('prod-unit').value,
                    harvestDate: document.getElementById('prod-harvest-date').value,
                    images: [...currentUploadImages],
                    img: currentUploadImages[0],
                    farmerId: currentUser.username
                };
                products.push(newProduct);
                showToast("Produce successfully listed!");
            }
            
            saveState();
            if (window.isAdminMode) {
                renderAdminListings();
            } else {
                renderFarmerListings();
            }
            addProduceForm.reset();
            prodImgFile.setAttribute('required', 'true');
            currentUploadImages = [];
            updatePreviewUI();
            window.closeFarmerForm();
        };

        saveProductData();
    });

    window.slideCarousel = (id, dir) => {
        const track = document.getElementById(`track-${id}`);
        if (!track) return;
        const total = track.children.length;
        let current = parseInt(track.getAttribute('data-idx') || '0');
        current += dir;
        if (current < 0) current = total - 1;
        if (current >= total) current = 0;
        track.setAttribute('data-idx', current);
        track.style.transform = `translateX(-${current * 100}%)`;
    };

    function getProductImageHTML(p) {
        if (p.images && p.images.length > 1) {
            const imgs = p.images.map(src => `<img src="${src}" alt="${p.name}">`).join('');
            return `
            <div class="carousel-container" id="carousel-${p.id}">
                <div class="carousel-track" id="track-${p.id}">
                    ${imgs}
                </div>
                <button class="carousel-btn prev" onclick="event.stopPropagation(); window.slideCarousel(${p.id}, -1)">&#10094;</button>
                <button class="carousel-btn next" onclick="event.stopPropagation(); window.slideCarousel(${p.id}, 1)">&#10095;</button>
            </div>`;
        } else {
            return `<img src="${p.img}" alt="${p.name}" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;">`;
        }
    }

    function renderFarmerListings() {
        const myProducts = products.filter(p => p.farmerId === currentUser.username);
        farmerListings.innerHTML = myProducts.map(p => `
            <div class="product-card">
                ${getProductImageHTML(p)}
                <div class="product-info">
                    <h4>${p.name}</h4>
                    <p>${p.qty} in stock</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <span style="font-weight: bold; color: var(--accent-terracotta);">₹</span>
                        <input type="number" id="price-edit-${p.id}" value="${p.price}" style="width: 70px; padding: 0.25rem; font-weight: bold;">
                        <button onclick="updatePrice(${p.id})" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background-color: var(--accent-slate); color: white;">Save</button>
                    </div>
                </div>
                <div class="product-actions" style="display: flex; gap: 0.5rem;">
                    <button onclick="editProduct(${p.id})" style="flex: 1; padding: 0.5rem; background-color: var(--accent-neon-green); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})" style="flex: 1;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteProduct = (id) => {
        products = products.filter(p => p.id !== id);
        saveState();
        renderFarmerListings();
    };

    window.updatePrice = (id) => {
        const newPriceStr = document.getElementById(`price-edit-${id}`).value;
        const newPrice = parseFloat(newPriceStr);
        if (!isNaN(newPrice) && newPrice >= 0) {
            const prod = products.find(p => p.id === id);
            if (prod) {
                prod.price = newPrice;
                saveState();
                showToast("Rate updated successfully!");
                renderFarmerListings();
            }
        } else {
            showToast("Please enter a valid rate.");
        }
    };

    // --- Live Ads Rotation Logic ---
    const adTexts = {
        'ad-text-1': [
            "Fresh A2 milk delivered daily.",
            "Organic paneer available today!",
            "10% off on monthly milk subscriptions."
        ],
        'ad-text-2': [
            "Organic free-range eggs available now.",
            "Freshly laid this morning.",
            "High protein duck eggs in stock."
        ],
        'ad-text-3': [
            "100% natural compost for your garden.",
            "Boost crop yield with organic urea.",
            "Eco-friendly pesticide sprays here."
        ],
        'ad-text-4': [
            "Affordable heavy machinery by the hour.",
            "Book a harvester for the weekend.",
            "Tractors with drivers available."
        ]
    };

    let adIndices = { 'ad-text-1': 0, 'ad-text-2': 0, 'ad-text-3': 0, 'ad-text-4': 0 };

    setInterval(() => {
        Object.keys(adTexts).forEach(id => {
            const pElement = document.getElementById(id);
            if(pElement) {
                // fade out
                pElement.style.opacity = '0';
                setTimeout(() => {
                    // update text
                    adIndices[id] = (adIndices[id] + 1) % adTexts[id].length;
                    pElement.textContent = adTexts[id][adIndices[id]];
                    // fade in
                    pElement.style.opacity = '1';
                }, 500); // Wait for transition
            }
        });
    }, 4000);

    // --- Ad Detail Logic ---
    const adDetailSection = document.getElementById('ad-detail-section');
    
    const adData = {
        'dairy': {
            icon: 'fa-cow',
            name: 'Local Dairy Farm',
            about: 'We are a local, family-owned dairy farm operating for over 15 years. We specialize in providing pure, unadulterated A2 milk directly from our grass-fed Gir cows to your doorstep within hours of milking.',
            rate: '₹50 - ₹60 / Litre',
            phone: '+91 98765 11111',
            email: 'hello@localdairy.in',
            address: 'Plot 45, Green Pastures, Dairy District'
        },
        'eggs': {
            icon: 'fa-egg',
            name: 'Sunrise Egg Farm',
            about: 'Sunrise Egg Farm brings you premium, organic free-range eggs. Our hens roam freely outdoors and are fed a 100% organic, antibiotic-free diet, resulting in eggs that are richer in nutrients and taste.',
            rate: '₹125 - ₹140 / Dozen',
            phone: '+91 98765 22222',
            email: 'sales@sunriseeggs.com',
            address: 'Survey No 12, Sunrise Valley'
        },
        'fertilizer': {
            icon: 'fa-leaf',
            name: 'GreenGrow Fertilizer',
            about: 'GreenGrow produces high-quality, 100% natural organic compost and vermicompost. Perfect for both home gardening and large-scale agriculture, our compost revitalizes soil health naturally.',
            rate: '₹10 - ₹17.5 / Kg',
            phone: '+91 98765 33333',
            email: 'contact@greengrow.in',
            address: 'Shed 3, Industrial Bio-Park'
        },
        'tractor': {
            icon: 'fa-tractor',
            name: 'Kisan Tractor Rentals',
            about: 'Need heavy machinery for a day or a season? Kisan Tractor Rentals offers a fleet of modern, well-maintained tractors and implements for all your plowing, tilling, and harvesting needs.',
            rate: '₹400 - ₹600 / Hour',
            phone: '+91 98765 44444',
            email: 'rentals@kisantractors.in',
            address: 'Main Highway Road, Agri Market'
        }
    };

    window.viewAdDetail = (adId) => {
        const ad = adData[adId];
        if(!ad) return;

        document.getElementById('ad-detail-icon').className = 'fas ' + ad.icon;
        document.getElementById('ad-detail-name').textContent = ad.name;
        document.getElementById('ad-detail-about').textContent = ad.about;
        document.getElementById('ad-detail-rate').textContent = ad.rate;
        document.getElementById('ad-detail-phone').textContent = ad.phone;
        document.getElementById('ad-detail-email').textContent = ad.email;
        document.getElementById('ad-detail-address').textContent = ad.address;

        const waButton = document.getElementById('ad-detail-whatsapp');
        if(waButton) {
            waButton.onclick = () => {
                // Remove spaces and special characters from phone for WhatsApp link
                const rawPhone = ad.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${rawPhone}?text=Hi%20${encodeURIComponent(ad.name)},%20I%20saw%20your%20ad%20on%20the%20Farmer-to-Consumer%20marketplace.`;
                window.open(waUrl, '_blank');
            };
        }

        consumerDashboard.classList.add('hidden');
        adDetailSection.classList.remove('hidden');
        window.scrollTo(0,0);
    };

    document.getElementById('btn-back-from-ad').addEventListener('click', () => {
        adDetailSection.classList.add('hidden');
        consumerDashboard.classList.remove('hidden');
    });

    // --- Consumer Logic ---
    const marketplaceGrid = document.getElementById('marketplace-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const productDetailSection = document.getElementById('product-detail-section');
    let currentDetailProductId = null;
    let currentDetailQty = 1;

    function renderMarketplace(filterCategory = null) {
        const headerTitle = document.querySelector('#consumer-dashboard .dashboard-header h2');
        if (headerTitle) {
            if (filterCategory === 'fruits') headerTitle.textContent = "Fruits & Vegetables";
            else if (filterCategory === 'dairy') headerTitle.textContent = "Dairy & Eggs";
            else if (filterCategory === 'grains') headerTitle.textContent = "Grains & Pulses";
            else if (filterCategory === 'spices') headerTitle.textContent = "Herbs & Spices";
            else if (filterCategory === 'meat') headerTitle.textContent = "Meat & Poultry";
            else headerTitle.textContent = "Marketplace";
        }

        let displayProducts = products;
        if (filterCategory) {
            displayProducts = products.filter(p => p.category === filterCategory);
        }
        
        if (displayProducts.length === 0) {
            marketplaceGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found in this category.</p>';
            return;
        }

        marketplaceGrid.innerHTML = displayProducts.map(p => `
            <div class="product-card">
                <div style="cursor:pointer;" onclick="viewProductDetail(${p.id})">
                    ${getProductImageHTML(p)}
                    <div class="product-info">
                        <h4>${p.name}</h4>
                        <p style="font-size:0.8rem; margin-bottom:0.5rem">${p.desc}</p>
                        <p>By: ${p.farmerId}</p>
                        <p class="price">₹${p.price.toFixed(2)} / ${p.unit}</p>
                    </div>
                </div>
                <button class="btn-add-cart" onclick="addToCart(${p.id}, 1)">Add to Cart</button>
            </div>
        `).join('');
    }

    window.viewProductDetail = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        currentDetailProductId = id;
        currentDetailQty = 1;
        
        document.getElementById('detail-img-container').innerHTML = getProductImageHTML(product);
        // Fix height for detail view specifically
        const detailCarousel = document.querySelector('#detail-img-container .carousel-container');
        if (detailCarousel) {
            detailCarousel.style.height = '100%';
            detailCarousel.style.minHeight = '300px';
        }
        
        document.getElementById('detail-name').textContent = product.name;
        document.getElementById('detail-desc').textContent = product.desc;
        document.getElementById('detail-farmer').textContent = 'By: ' + product.farmerId;
        document.getElementById('detail-price').textContent = '₹' + product.price.toFixed(2) + ' / ' + product.unit;
        document.getElementById('detail-qty-val').textContent = currentDetailQty;
        
        // Populate Related Products
        const relatedGrid = document.getElementById('related-products-grid');
        // Pick 6 random items, excluding the current one
        const related = products.filter(p => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 6);
        
        relatedGrid.innerHTML = related.map(p => `
            <div class="product-card" style="border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="cursor:pointer;" onclick="viewProductDetail(${p.id}); window.scrollTo(0,0);">
                    ${getProductImageHTML(p)}
                    <div class="product-info" style="padding: 0.75rem;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${p.name}</h4>
                        <p class="price" style="font-size: 1.1rem; color: var(--accent-primary); font-weight: bold;">₹${p.price.toFixed(2)} / ${p.unit}</p>
                    </div>
                </div>
                <button class="btn-add-cart" onclick="addToCart(${p.id}, 1)" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border-top: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ Add</button>
            </div>
        `).join('');

        consumerDashboard.classList.add('hidden');
        productDetailSection.classList.remove('hidden');
        window.scrollTo(0,0);
    };

    document.getElementById('btn-back-from-detail').addEventListener('click', () => {
        productDetailSection.classList.add('hidden');
        consumerDashboard.classList.remove('hidden');
    });

    document.getElementById('detail-qty-minus').addEventListener('click', () => {
        if (currentDetailQty > 1) {
            currentDetailQty--;
            document.getElementById('detail-qty-val').textContent = currentDetailQty;
        }
    });

    document.getElementById('detail-qty-plus').addEventListener('click', () => {
        const product = products.find(p => p.id === currentDetailProductId);
        if (!product) return;
        const maxQty = product.unit === 'kg' ? 5 : (product.unit === 'dozen' ? 10 : 8);

        if (currentDetailQty < maxQty) {
            currentDetailQty++;
            document.getElementById('detail-qty-val').textContent = currentDetailQty;
        } else {
            alert(`Maximum allowed for ${product.name} is ${maxQty} ${product.unit === 'kg' ? 'kg' : (product.unit === 'dozen' ? 'dozens' : 'pieces')}.`);
        }
    });

    document.getElementById('detail-add-cart-btn').addEventListener('click', () => {
        if (currentDetailProductId) {
            window.addToCart(currentDetailProductId, currentDetailQty);
            productDetailSection.classList.add('hidden');
            consumerDashboard.classList.remove('hidden');
        }
    });

    window.addToCart = (id, qty = 1) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        const existing = cart.find(item => item.id === id);
        let currentQty = existing ? existing.cartQty : 0;
        let newQty = currentQty + qty;

        const maxQty = product.unit === 'kg' ? 5 : (product.unit === 'dozen' ? 10 : 8);

        if (newQty > maxQty) {
            alert(`Limit reached! You can only buy up to ${maxQty} ${product.unit === 'kg' ? 'kg' : (product.unit === 'dozen' ? 'dozens' : 'pieces')} of ${product.name}.`);
            newQty = maxQty;
        } else if (qty === 1) {
            showToast("Added to cart!");
        }

        if (existing) {
            existing.cartQty = newQty;
        } else {
            cart.push({ ...product, cartQty: newQty });
        }
        renderCart();
    };

    function renderCart() {
        if (currentUser) {
            currentUser.cart = cart;
            saveState();
        }

        const navCartCount = document.getElementById('nav-cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.cartQty, 0);
        if(navCartCount) navCartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartSummary.classList.add('hidden');
            return;
        }

        cartSummary.classList.remove('hidden');
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} (x${item.cartQty})</span>
                <span>₹${(item.price * item.cartQty).toFixed(2)}</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
        cartTotalEl.textContent = `₹${total.toFixed(2)}`;
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            renderOrderReview();
            consumerDashboard.classList.add('hidden');
            document.getElementById('order-review-section').classList.remove('hidden');
            window.scrollTo(0, 0);
        }
    });

    const orderReviewSection = document.getElementById('order-review-section');
    
    document.getElementById('cancel-order-btn').addEventListener('click', () => {
        orderReviewSection.classList.add('hidden');
        consumerDashboard.classList.remove('hidden');
    });

    document.getElementById('confirm-order-btn').addEventListener('click', () => {
        orderReviewSection.classList.add('hidden');
        consumerDashboard.classList.remove('hidden'); // Go back to dashboard
        checkoutModal.classList.remove('hidden');
        cart = [];
        renderCart();
    });

    window.updateReviewQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if(!item) return;
        const maxQty = item.unit === 'kg' ? 5 : (item.unit === 'dozen' ? 10 : 8);
        
        let newQty = item.cartQty + delta;
        if(newQty <= 0) {
            // Remove item
            cart = cart.filter(i => i.id !== id);
        } else if (newQty > maxQty) {
            alert(`Limit reached! You can only buy up to ${maxQty} ${item.unit === 'kg' ? 'kg' : (item.unit === 'dozen' ? 'dozens' : 'pieces')} of ${item.name}.`);
        } else {
            item.cartQty = newQty;
        }
        
        if (cart.length === 0) {
            // Cart empty, go back
            orderReviewSection.classList.add('hidden');
            consumerDashboard.classList.remove('hidden');
        } else {
            renderOrderReview();
        }
        renderCart();
    };

    function calculateDeliveryCharge(itemTotal) {
        if (itemTotal < 500) {
            return 50.00;
        } else if (itemTotal < 1000) {
            return 40.00;
        } else {
            return itemTotal * 0.02;
        }
    }

    function renderOrderReview() {
        const reviewContainer = document.getElementById('review-items-container');
        reviewContainer.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
                <div style="flex: 1;">
                    <span style="font-weight: bold; color: var(--text-primary);">${item.name}</span>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">₹${item.price.toFixed(2)} / ${item.unit}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateReviewQty(${item.id}, -1)" style="padding: 0.3rem 0.6rem; border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-primary); border-radius: 4px; cursor: pointer;">-</button>
                    <span style="color: var(--text-primary); min-width: 20px; text-align: center;">${item.cartQty}</span>
                    <button onclick="updateReviewQty(${item.id}, 1)" style="padding: 0.3rem 0.6rem; border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-primary); border-radius: 4px; cursor: pointer;">+</button>
                </div>
                <div style="min-width: 80px; text-align: right; color: var(--text-primary); font-weight: bold;">
                    ₹${(item.price * item.cartQty).toFixed(2)}
                </div>
            </div>
        `).join('');

        const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
        const deliveryCharge = calculateDeliveryCharge(itemTotal);
        const platformFee = 10.00;
        const grandTotal = itemTotal + deliveryCharge + platformFee;

        document.getElementById('review-item-total').textContent = `₹${itemTotal.toFixed(2)}`;
        
        const deliveryChargeEl = document.getElementById('review-delivery-charge');
        deliveryChargeEl.textContent = `₹${deliveryCharge.toFixed(2)}`;
        deliveryChargeEl.style.color = '#ef4444'; // Red for charges
        
        document.getElementById('review-platform-fee').textContent = `₹${platformFee.toFixed(2)}`;
        document.getElementById('review-grand-total').textContent = `₹${grandTotal.toFixed(2)}`;
    }

    closeModalBtn.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });

    // --- Master Admin Logic ---
    window.isAdminMode = false;

    window.adminLoginPrompt = () => {
        const uname = prompt("Enter Admin Username:");
        if (uname === "shashank123") {
            const pwd = prompt("Enter Admin Password:");
            if (pwd === "shashank123") {
                window.isAdminMode = true;
                
                document.getElementById('auth-section').classList.add('hidden');
                document.getElementById('auth-section').classList.remove('active-section');
                document.getElementById('marketing-page').classList.add('hidden');
                document.getElementById('marketing-page').classList.remove('active-section');
                
                document.getElementById('admin-dashboard').classList.remove('hidden');
                renderAdminListings();
                showToast("Welcome to Master Admin Portal");
                window.scrollTo(0,0);
            } else if (pwd !== null) {
                alert("Incorrect password.");
            }
        } else if (uname !== null) {
            alert("Incorrect username.");
        }
    };

    window.logoutAdmin = () => {
        window.isAdminMode = false;
        location.reload();
    };

    window.renderAdminListings = () => {
        const adminGrid = document.getElementById('admin-listings');
        if (!adminGrid) return;
        adminGrid.innerHTML = products.map(p => `
            <div class="product-card">
                ${getProductImageHTML(p)}
                <div class="product-info">
                    <h4>${p.name}</h4>
                    <p style="color: var(--accent-slate); font-size: 0.85rem; font-weight: bold;">Farmer ID: ${p.farmerId}</p>
                    <p>${p.qty} in stock</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <span style="font-weight: bold; color: var(--accent-terracotta);">₹</span>
                        <input type="number" id="price-edit-admin-${p.id}" value="${p.price}" style="width: 70px; padding: 0.25rem; font-weight: bold;">
                        <button onclick="updatePriceAdmin(${p.id})" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background-color: var(--accent-slate); color: white;">Save</button>
                    </div>
                </div>
                <div class="product-actions" style="display: flex; gap: 0.5rem;">
                    <button onclick="editProduct(${p.id})" style="flex: 1; padding: 0.5rem; background-color: var(--accent-neon-green); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Edit</button>
                    <button class="btn-delete" onclick="deleteProductAdmin(${p.id})" style="flex: 1;">Delete</button>
                </div>
            </div>
        `).join('');
    };

    window.updatePriceAdmin = (id) => {
        const newPriceStr = document.getElementById(`price-edit-admin-${id}`).value;
        const newPrice = parseFloat(newPriceStr);
        if (!isNaN(newPrice) && newPrice >= 0) {
            const prod = products.find(p => p.id === id);
            if (prod) {
                prod.price = newPrice;
                saveState();
                showToast("Rate updated globally!");
                renderAdminListings();
            }
        } else {
            showToast("Please enter a valid rate.");
        }
    };

    window.deleteProductAdmin = (id) => {
        products = products.filter(p => p.id !== id);
        saveState();
        renderAdminListings();
    };

    const navRefresh = document.getElementById('nav-refresh');
    if (navRefresh) {
        navRefresh.addEventListener('click', () => {
            location.reload();
        });
    }
});
