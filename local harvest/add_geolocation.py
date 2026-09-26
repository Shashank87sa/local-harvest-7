index_path = r'C:\Users\Pushpendra\Desktop\farmer-consumer-fullstack\frontend\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the alert in the live location button
old_button = """<button id="btn-live-location" onclick="alert('Accessing live location...')" style="width: 100%; padding: 1rem; background-color: rgba(37, 99, 235, 0.1); color: #3b82f6; border: 1px dashed #3b82f6; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; transition: all 0.2s;">
                <i class="fas fa-location-arrow"></i> Use my current live location
            </button>"""

new_button = """<button id="btn-live-location" type="button" onclick="fetchLiveLocation()" style="width: 100%; padding: 1rem; background-color: rgba(37, 99, 235, 0.1); color: #3b82f6; border: 1px dashed #3b82f6; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; transition: all 0.2s;">
                <i class="fas fa-location-arrow"></i> <span id="live-loc-text">Use my current live location</span>
            </button>"""

content = content.replace(old_button, new_button)

# Add the fetchLiveLocation script at the end of the body
script_html = """
<script>
async function fetchLiveLocation() {
    const btnText = document.getElementById('live-loc-text');
    const originalText = btnText.innerText;
    
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    btnText.innerText = "Locating...";
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Use Nominatim OpenStreetMap API for reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            
            if (data && data.address) {
                // Fill up the form fields
                document.getElementById('addr-pincode').value = data.address.postcode || '';
                document.getElementById('addr-state').value = data.address.state || '';
                document.getElementById('addr-district').value = data.address.state_district || data.address.city || data.address.county || '';
                document.getElementById('addr-locality').value = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || '';
                document.getElementById('addr-flat').value = data.address.road || data.name || '';
                
                // Add a visual flash to show it updated
                const inputs = ['addr-pincode', 'addr-state', 'addr-district', 'addr-locality', 'addr-flat'];
                inputs.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.transition = 'background 0.3s';
                        el.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                        setTimeout(() => el.style.backgroundColor = 'var(--bg-main)', 1000);
                    }
                });
            } else {
                alert("Could not retrieve address details.");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching address details.");
        } finally {
            btnText.innerText = originalText;
        }
    }, (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        btnText.innerText = originalText;
    });
}
</script>
"""

if 'async function fetchLiveLocation()' not in content:
    content = content.replace('</body>', script_html + '\n</body>')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(content)
