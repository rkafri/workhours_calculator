function calculateEndTime() {
    const startTime = document.getElementById('startTime').value;
    const firstExitTime = document.getElementById('firstExitTime').value;
    const firstReturnTime = document.getElementById('firstReturnTime').value;
    const secondExitTime = document.getElementById('secondExitTime').value;
    const secondReturnTime = document.getElementById('secondReturnTime').value;
    
    if (!startTime) {
        alert('נא להזין שעת כניסה');
        return;
    }
    
    let totalWorkMinutes = 0;
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const targetWorkMinutes = 8 * 60; // 8 שעות עבודה
    
    // הגדרת ההפסקות הקבועות
    const breaks = [
        { start: new Date(`2000-01-01T09:15`), end: new Date(`2000-01-01T09:30`) },
        { start: new Date(`2000-01-01T12:15`), end: new Date(`2000-01-01T12:45`) }
    ];
    
    // הוספת ההפסקות שהוזנו על ידי המשתמש (רק אם הוזנו)
    if (firstExitTime && firstReturnTime) {
        breaks.push({ 
            start: new Date(`2000-01-01T${firstExitTime}`), 
            end: new Date(`2000-01-01T${firstReturnTime}`) 
        });
    }
    if (secondExitTime && secondReturnTime) {
        breaks.push({ 
            start: new Date(`2000-01-01T${secondExitTime}`), 
            end: new Date(`2000-01-01T${secondReturnTime}`) 
        });
    }
    
    // מיון ההפסקות לפי זמן התחלה
    breaks.sort((a, b) => a.start - b.start);
    
    while (totalWorkMinutes < targetWorkMinutes) {
        let nextBreakStart = null;
        let isInBreak = false;
        
        // בדיקה אם הזמן הנוכחי הוא בתוך הפסקה
        for (let breakTime of breaks) {
            if (currentTime >= breakTime.start && currentTime < breakTime.end) {
                currentTime = new Date(breakTime.end);
                isInBreak = true;
                break;
            } else if (currentTime < breakTime.start) {
                nextBreakStart = breakTime.start;
                break;
            }
        }
        
        if (!isInBreak) {
            if (nextBreakStart) {
                let workMinutes = Math.min(
                    (nextBreakStart - currentTime) / (1000 * 60),
                    targetWorkMinutes - totalWorkMinutes
                );
                totalWorkMinutes += workMinutes;
                currentTime = new Date(currentTime.getTime() + workMinutes * 60 * 1000);
            } else {
                // אם אין עוד הפסקות, נוסיף את שאר זמן העבודה
                let remainingMinutes = targetWorkMinutes - totalWorkMinutes;
                totalWorkMinutes += remainingMinutes;
                currentTime = new Date(currentTime.getTime() + remainingMinutes * 60 * 1000);
            }
        }
    }
    
    const formattedEndTime = currentTime.toTimeString().slice(0, 5);
    document.getElementById('result').innerHTML = `שעת סיום העבודה: ${formattedEndTime}`;

    // עדכון הטבלה
    updateHoursTable(new Date(`2000-01-01T${startTime}`), currentTime);
}

function updateHoursTable(startTime, endTime) {
    const tableBody = document.querySelector('#hoursTable tbody');
    tableBody.innerHTML = ''; // ניקוי הטבלה

    const standardWorkTime = 8 * 60; // 8 שעות בדקות
    const intervals = [120, 105, 90, 75, 60, 45, 30, 15, 0, -15, -30, -45, -60, -75, -90, -105, -120]; // מדרגות של 15 דקות, סדר הפוך

    intervals.forEach((interval) => {
        const adjustedTime = new Date(endTime.getTime() + interval * 60000);
        const workTime = (adjustedTime - startTime) / (1000 * 60);
        const difference = workTime - standardWorkTime;

        const row = tableBody.insertRow();
        const cellOvertime = row.insertCell(0);
        const cellEndTime = row.insertCell(1);

        if (interval === 0) {
            cellOvertime.textContent = adjustedTime.toTimeString().slice(0, 5);
            cellEndTime.textContent = "";
            row.className = 'standard-time';
            cellOvertime.colSpan = 2;
            cellEndTime.style.display = 'none';
        } else {
            cellOvertime.textContent = formatTimeDifference(interval);
            cellEndTime.textContent = adjustedTime.toTimeString().slice(0, 5);
            row.className = interval > 0 ? 'overtime' : 'undertime';
        }
    });
}

function formatTimeDifference(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes < 0 ? '-' : '+';
    return `${sign}${hours}:${mins.toString().padStart(2, '0')}`;
}
