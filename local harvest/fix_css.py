path = r'C:\Users\Pushpendra\Desktop\farmer-consumer-fullstack\frontend\style.css'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if '/* Add Address View Specific Styles */' in line:
        skip = True
        continue
    if skip and '.addr-input-group.active-blue label {' in line:
        skip = False
        continue
    if not skip:
        new_lines.append(line)

css_append = """
/* Add Address View Specific Styles */
.addr-input-group {
    position: relative;
    margin-bottom: 12px;
    margin-top: 8px;
}
.addr-input-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    font-size: 14px;
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
"""

idx = 0
for i, l in enumerate(new_lines):
    if '.input-icon {' in l:
        idx = i
        break

if idx > 0:
    new_lines.insert(idx, css_append)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
