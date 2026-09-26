index_path = r'C:\Users\Pushpendra\Desktop\farmer-consumer-fullstack\frontend\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_header = """<header class="dashboard-header">
            <h2>Marketplace</h2>
            <p>Shop directly from local farmers.</p>
        </header>"""

new_header = """<header class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>Marketplace</h2>
                <p>Shop directly from local farmers.</p>
            </div>
            <button id="btn-select-address" onclick="document.getElementById('address-modal').classList.remove('hidden')" style="padding: 0.8rem 1.5rem; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;">
                <i class="fas fa-map-marker-alt" style="color: #ef4444;"></i> <span id="display-address-header">Select Address</span>
            </button>
        </header>"""

content = content.replace(old_header, new_header)

address_modal = """
    <!-- Address Modal for Marketplace -->
    <div id="address-modal" class="modal hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; justify-content: center; align-items: center; overflow-y: auto;">
        <div class="modal-content" style="width: 90%; max-width: 500px; padding: 2rem; border-radius: 1rem; background: var(--bg-card); position: relative; margin: 2rem auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-primary); font-size: 1.5rem; margin: 0;">Select Delivery Address</h3>
                <button onclick="document.getElementById('address-modal').classList.add('hidden')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.5rem;"><i class="fas fa-times"></i></button>
            </div>
            
            <!-- Live Location Button -->
            <button id="btn-live-location" onclick="alert('Accessing live location...')" style="width: 100%; padding: 1rem; background-color: rgba(37, 99, 235, 0.1); color: #3b82f6; border: 1px dashed #3b82f6; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; transition: all 0.2s;">
                <i class="fas fa-location-arrow"></i> Use my current live location
            </button>
            
            <div style="text-align: center; color: var(--text-muted); margin-bottom: 1.5rem; position: relative;">
                <hr style="border: 0; border-top: 1px solid var(--border-color); position: absolute; width: 100%; top: 50%; z-index: 1;">
                <span style="background: var(--bg-card); padding: 0 10px; position: relative; z-index: 2; font-size: 0.9rem;">OR ENTER MANUALLY</span>
            </div>

            <form id="address-form" style="display: flex; flex-direction: column; gap: 1rem;" onsubmit="event.preventDefault(); document.getElementById('address-modal').classList.add('hidden'); alert('Address Saved!'); document.getElementById('display-address-header').innerText = document.getElementById('addr-locality').value;">
                <div class="input-group" style="margin-bottom: 0;">
                    <input type="text" id="addr-pincode" placeholder="Pincode" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #3f3f46; background-color: var(--bg-main); color: var(--text-primary); outline: none;">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="input-group" style="margin-bottom: 0;">
                        <input type="text" id="addr-state" placeholder="State" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #3f3f46; background-color: var(--bg-main); color: var(--text-primary); outline: none;">
                    </div>
                    <div class="input-group" style="margin-bottom: 0;">
                        <input type="text" id="addr-district" placeholder="District/City" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #3f3f46; background-color: var(--bg-main); color: var(--text-primary); outline: none;">
                    </div>
                </div>
                <div class="input-group" style="margin-bottom: 0;">
                    <input type="text" id="addr-locality" placeholder="Area / Locality / Village" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #3f3f46; background-color: var(--bg-main); color: var(--text-primary); outline: none;">
                </div>
                <div class="input-group" style="margin-bottom: 0;">
                    <input type="text" id="addr-flat" placeholder="Flat, House no., Building, Apartment" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #3f3f46; background-color: var(--bg-main); color: var(--text-primary); outline: none;">
                </div>
                <button type="submit" style="width: 100%; padding: 1.2rem; background-color: #10b981; color: white; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; margin-top: 1rem; font-size: 1.1rem;">Save Address</button>
            </form>
        </div>
    </div>
"""

if 'id="address-modal"' not in content:
    content = content.replace('</body>', address_modal + '\n</body>')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(content)
