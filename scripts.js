let actionCount = 1;

function addRequirement(button) {
    const requirementsDiv = button.parentElement.querySelector('.requirements');
    const requirementDiv = document.createElement('div');
    requirementDiv.classList.add('form-group', 'requirement', 'reqbox');

    requirementDiv.innerHTML = `
        <label for="requirementProperty">Kondisi: *</label>
        <select class="requirementProperty">
            <option value="supporter_name">Supporter Name</option>
            <option value="support_message">Support Message</option>
            <option value="amount">Amount</option>
            <option value="unit_name">Unit Name</option>
            <option value="quantity">Quantity</option>
            <option value="receiver">Receiver</option>
        </select><br><br>
        <label for="operator">Operator: *</label>
        <select class="operator">
            <option value="contains">contains (Mengandung)</option>
            <option value="=">= (Sama/Persis)</option>
            <option value=">=">>= (Lebih Besar atau sama)</option>
            <option value="<="><= (Lebih Kecil atau sama)</option>
            <option value=">">> (Lebih Besar)</option>
            <option value="<">< (Lebih Kecil)</option>
        </select><br><br>
        <label for="value">Value: *</label>
        <input type="text" class="value" required><br><br>
        <button type="button" class="deleteButton" onclick="removeRequirement(this)">Hapus
                                Kondisi ini</button>
    `;

    requirementsDiv.appendChild(requirementDiv);
}

function removeRequirement(button) {
    button.parentElement.remove();
}

function addAction() {
    const actionsContainer = document.getElementById('actionsContainer');
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action', 'actionbox');
    actionDiv.setAttribute('data-action-index', actionCount++);

    actionDiv.innerHTML = `
        <form class="configForm">
            <div class="form-group">
                <label for="actionName">Nama Action: * (dibolehkan: a-z_)</label>
                <input type="text" class="actionName" required>
            </div>
            <div class="form-group">
                        Offline?: <input type="checkbox" class="offline">
            </div>
            <div class="form-group">
                <label for="include">Include Action:</label>
                <input type="text" class="include">
            </div>
            <div class="requirements">
            <div class="form-group requirement reqbox">
        <label for="requirementProperty">Kondisi: * (setiap custom action harus ada minimal 1 kondisi)</label>
        <select class="requirementProperty">
            <option value="supporter_name">Supporter Name</option>
            <option value="support_message">Support Message</option>
            <option value="amount">Amount</option>
            <option value="unit_name">Unit Name</option>
            <option value="quantity">Quantity</option>
            <option value="receiver">Receiver</option>
        </select><br><br>
        <label for="operator">Operator: *</label>
        <select class="operator">
            <option value="contains">contains (Mengandung)</option>
            <option value="=">= (Sama/Persis)</option>
            <option value=">=">&gt;= (Lebih Besar atau sama)</option>
            <option value="<=">&lt;= (Lebih Kecil atau sama)</option>
            <option value=">">&gt; (Lebih Besar)</option>
            <option value="<">&lt; (Lebih Kecil)</option>
        </select><br><br>
        <label for="value">Value: *</label>
        <input type="text" class="value" required=""><br><br>
  
    </div>
            </div>
            <button type="button" class="requirementButton" onclick="addRequirement(this)">Tambah
                        Kondisi</button>
            <div class="form-group">
                <label for="commands">Minecraft Commands (perbaris, tanpa /): *</label>
                <textarea class="no-wrap-textarea commands" rows="5" required></textarea>
            </div>
        </form>
        <button type="button" class="deleteButton" onclick="removeAction(this)">Hapus Action Ini</button>
    `;

    actionsContainer.appendChild(actionDiv);

}

function removeAction(button) {
    button.parentElement.remove();
}


function generateConfig() {
    const actions = document.querySelectorAll('.action');
    let config = '';

    actions.forEach(action => {
        const actionName = action.querySelector('.actionName').value.trim();
        const offline = action.querySelector('.offline').checked;
        const include = action.querySelector('.include').value.trim();
        const requirements = action.querySelectorAll('.requirement');
        const commands = action.querySelector('.commands').value.trim().split('\n');
        const commandbox = action.querySelector('.commands').value.trim();

        if (!actionName || commands.length === 0) {
            alert('Tolong isi semua input yang dibutuhkan (ditandai *)');
            return;
        }

        config += `### ${actionName}\n`;
        if (offline) config += `:offline\n`;

        requirements.forEach(requirement => {
            const property = requirement.querySelector('.requirementProperty').value;
            const operator = requirement.querySelector('.operator').value;
            const value = requirement.querySelector('.value').value.trim();
            if (value) {
                config += `:if ${property} ${operator} ${value}\n`;
            } else {
                config += `!ERROR - Kondisi Value harus diisi.\n`;
            }


        });
        if (include) config += `:include ${include}\n`;

        if (commandbox) {
            commands.forEach(command => {
                config += `${command}\n`;
            });
        } else {
            config += `!ERROR - Minecraft Commands harus diisi.\n`;
        }


        config += `\n`;
    });

    document.getElementById('configOutput').value = config.trim();
}


document.getElementById('copyButton').addEventListener('click', function () {
    var textarea = document.getElementById('configOutput');

    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copy text command was ' + msg);
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }
});
