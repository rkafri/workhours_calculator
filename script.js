function calculateEndTime() {
    const entryTime = document.getElementById('entryTime').value;
    const firstExitTime = document.getElementById('firstExitTime').value;
    const firstReturnTime = document.getElementById('firstReturnTime').value;
    const secondExitTime = document.getElementById('secondExitTime').value;
    const secondReturnTime = document.getElementById('secondReturnTime').value;

    if (!entryTime) {
        alert('נא להזין שעת כניסה');
        return;
    }

    let totalWorkMinutes = 0;
    let currentTime = new Date(`2000-01-01T${entryTime}`);
    let endTime = new Date(`2000-01-01T${entryTime}`);
    endTime.setHours(endTime.getHours() + 9); // Set end time to 9 hours after entry

    if (firstExitTime) {
        const exitTime = new Date(`2000-01-01T${firstExitTime}`);
        totalWorkMinutes += (exitTime - currentTime) / 60000;
        
        if (firstReturnTime) {
            const returnTime = new Date(`2000-01-01T${firstReturnTime}`);
            endTime = new Date(endTime.getTime() + (returnTime - exitTime));
            currentTime = returnTime;
        } else {
            currentTime = exitTime;
        }
    }

    if (secondExitTime && firstReturnTime) {
        const exitTime = new Date(`2000-01-01T${secondExitTime}`);
        totalWorkMinutes += (exitTime - currentTime) / 60000;
        
        if (secondReturnTime) {
            const returnTime = new Date(`2000-01-01T${secondReturnTime}`);
            endTime = new Date(endTime.getTime() + (returnTime - exitTime));
            currentTime = returnTime;
        } else {
            currentTime = exitTime;
        }
    }

    const remainingMinutes = (endTime - currentTime) / 60000;

    if (remainingMinutes <= 0) {
        document.getElementById('result').innerHTML = 'זמן העבודה הושלם';
        updateHoursTable(Math.abs(remainingMinutes / 60), 0);
    } else {
        const formattedEndTime = endTime.toTimeString().slice(0, 5);
        document.getElementById('result').innerHTML = `שעת סיום מחושבת: ${formattedEndTime}`;
        updateHoursTable(0, remainingMinutes / 60);
    }
}

function updateHoursTable(overtimeHours, missingHours) {
    const table = document.getElementById('hoursTable');
    table.innerHTML = ''; // Clear existing rows

    const today = new Date().toLocaleDateString('he-IL', { weekday: 'long' });
    const row = table.insertRow();
    
    const dayCell = row.insertCell(0);
    const overtimeCell = row.insertCell(1);
    const missingCell = row.insertCell(2);

    dayCell.textContent = today;
    
    if (overtimeHours > 0) {
        overtimeCell.textContent = overtimeHours.toFixed(2);
        overtimeCell.classList.add('overtime');
        missingCell.textContent = '0.00';
    } else {
        overtimeCell.textContent = '0.00';
        missingCell.textContent = missingHours.toFixed(2);
        missingCell.classList.add('missing');
    }
}