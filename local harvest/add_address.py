import re

user_html = """
<div id="address-section" class="hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: flex; justify-content: center; background-color: #e0e0e0; overflow-y: auto;">
<div class="app-container" style="width: 100%; max-width: 400px; background-color: #f5f6f8; min-height: 100vh; position: relative; padding-bottom: 80px;">
    <!-- Header -->
    <div class="header" style="display: flex; align-items: center; padding: 16px 20px; background-color: #ffffff; gap: 16px;">
        <div class="back-btn" id="btn-back-from-address" style="background: #f1f3f4; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <span class="material-symbols-outlined" style="font-size: 20px; color: #202124;">arrow_back</span>
        </div>
        <h1 style="font-size: 18px; font-weight: 700; color: #202124;">Edit Address</h1>
    </div>

    <!-- Selected Location Card -->
    <div class="card" style="background-color: #ffffff; margin: 12px 16px; border-radius: 16px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <div class="location-content" style="display: flex; gap: 12px; align-items: center;">
            <div class="map-thumbnail" style="width: 60px; height: 60px; background-color: #e8eaed; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <span class="material-symbols-outlined map-pin" style="color: #1a73e8; font-size: 32px; z-index: 1; position: absolute;">location_on</span>
                <div class="map-pin-inner" style="width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: 25%; left: 36%; z-index: 2;"></div>
            </div>
            <div style="flex: 1;">
                <div class="location-header" style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span class="location-label" style="font-size: 10px; font-weight: 600; color: #5f6368; letter-spacing: 0.5px;">SELECTED LOCATION</span>
                    <a href="#" class="change-btn" style="color: #1a73e8; font-size: 14px; font-weight: 600; text-decoration: none;">Change</a>
                </div>
                <div class="address-text" style="font-size: 14px; color: #5f6368; line-height: 1.4; flex: 1;">
                    Adarsh Nagar, Deva Road, Matiyari, Kamta, Lucknow, Uttar Pradesh, 226028
                </div>
            </div>
        </div>
    </div>

    <!-- Address Details Card -->
    <div class="card" style="background-color: #ffffff; margin: 12px 16px; border-radius: 16px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <h2 class="section-title" style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: #202124;">Address details</h2>
        
        <div class="input-group addr-input-group">
            <label>Flat/House number/Building name <span class="asterisk" style="color: #d93025;">*</span></label>
            <input type="text" value="H .no. 56,57 himcity colony adarsh nagar">
        </div>

        <h2 class="section-title" style="font-size: 14px; font-weight: 700; color: #202124; margin-top: 24px; margin-bottom: 12px;">Save address as</h2>
        <div class="chips-container">
            <div class="chip active">
                <span class="material-symbols-outlined">home</span> Home
            </div>
            <div class="chip">
                <span class="material-symbols-outlined">domain</span> Work
            </div>
            <div class="chip">
                <span class="material-symbols-outlined">location_on</span> Other
            </div>
        </div>

        <div class="input-group addr-input-group">
            <input type="text" placeholder="Save as" class="placeholder-input">
        </div>
    </div>

    <!-- Receiver Details Card -->
    <div class="card" style="background-color: #ffffff; margin: 12px 16px; margin-bottom: 24px; border-radius: 16px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <h2 class="section-title" style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: #202124;">Receiver details</h2>
        
        <div class="checkbox-group">
            <input type="checkbox" id="useAccount">
            <label for="useAccount">Use my account details</label>
        </div>

        <div class="input-group addr-input-group active-blue">
            <label>Receiver name <span class="asterisk" style="color: #d93025;">*</span></label>
            <input type="text" class="active" value="Shashank Chaurasiya" style="border-color: #1a73e8;">
        </div>

        <div class="input-group addr-input-group">
            <label>Phone number <span class="asterisk" style="color: #d93025;">*</span></label>
            <input type="text" value="9369626296">
            <button class="input-icon">
                <span class="material-symbols-outlined">contact_book</span>
            </button>
        </div>

        <div class="input-group addr-input-group">
            <input type="text" placeholder="Alternate phone number (optional)" class="placeholder-input">
        </div>
    </div>

    <!-- Fixed Bottom Bar -->
    <div class="bottom-bar" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 16px; background-color: #f5f6f8;">
        <button class="btn-save" id="btn-save-address" onclick="document.getElementById('address-section').classList.add('hidden')">Save address</button>
    </div>
</div>
</div>
"""

css_append = """
/* Add Address View Specific Styles */
.addr-input-group {
    position: relative;
    margin-bottom: 16px;
    margin-top: 10px;
}
.addr-input-group input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #dadce0;
    border-radius: 12px;
    font-size: 15px;
    outline: none;
    color: #202124;
    font-family: "Comic Sans MS", "Chalkboard SE", sans-serif; 
    background-color: transparent;
}
.addr-input-group input:focus, .addr-input-group input.active {
    border-color: #1a73e8;
}
.addr-input-group label {
    position: absolute;
    top: -8px;
    left: 12px;
    background-color: #ffffff;
    padding: 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: #5f6368;
    font-family: sans-serif;
}
.addr-input-group.active-blue label {
    color: #1a73e8;
}
.input-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #5f6368;
    background: none;
    border: none;
    display: flex;
    align-items: center;
}
.placeholder-input {
    font-family: sans-serif !important;
}
.chips-container {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}
.chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border: 1px solid #dadce0;
    border-radius: 20px;
    font-size: 14px;
    color: #5f6368;
    cursor: pointer;
    font-weight: 500;
}
.chip.active {
    border-color: #1a73e8;
    color: #1a73e8;
    background-color: #f4f8ff;
}
.chip span {
    font-size: 18px;
}
.checkbox-group {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}
.checkbox-group input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #dadce0;
    appearance: none;
    outline: none;
    cursor: pointer;
    background-color: white;
}
.checkbox-group input[type="checkbox"]:checked {
    background-color: #1a73e8;
    border-color: #1a73e8;
}
.checkbox-group label {
    font-size: 14px;
    font-weight: 500;
    color: #202124;
}
.btn-save {
    width: 100%;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);
}
.btn-save:active {
    background-color: #1557b0;
}
"""

index_path = r'C:\Users\Pushpendra\Desktop\farmer-consumer-fullstack\frontend\index.html'
style_path = r'C:\Users\Pushpendra\Desktop\farmer-consumer-fullstack\frontend\style.css'

with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

if '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />' not in content:
    content = content.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />\n</head>')

btn_html = '''
                <!-- Manage Addresses Button -->
                <div style="margin-bottom: 2.5rem; text-align: center;">
                    <button type="button" id="btn-manage-address" onclick="document.getElementById('address-section').classList.remove('hidden')" style="padding: 0.8rem 1.5rem; background-color: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; width: 100%;"><i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i> Manage Address</button>
                </div>
'''
if 'id="btn-manage-address"' not in content:
    content = content.replace('<!-- Hidden URL input so JS doesn\'t break if it looks for it -->', btn_html + '<!-- Hidden URL input so JS doesn\'t break if it looks for it -->')

if 'id="address-section"' not in content:
    content = content.replace('</body>', user_html + '\n</body>')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(content)

with open(style_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

if 'addr-input-group' not in css_content:
    with open(style_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

print("Done")
