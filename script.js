document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const tableSection = document.querySelector('.table-section');

    calculateBtn.addEventListener('click', calculateWorkHours);

    function calculateWorkHours() {
        const startTime = document.getElementById('startTime').value;
        const firstEndTime = document.getElementById('firstEndTime').value;
        const firstReturnTime = document.getElementById('firstReturnTime').value;
        const secondEndTime = document.getElementById('secondEndTime').value;
        const secondReturnTime = document.getElementById('secondReturnTime').value;

        if (!startTime) {
            alert('נא להזין שעת כניסה');
            return;
        }

        let totalWorkMinutes = 0;
        let breaks = [];

        const addTimeRange = (start, end) => {
            if (start && end) {
                const diff = getTimeDifferenceInMinutes(start, end);
                totalWorkMinutes += diff;
                return diff;
            }
            return 0;
        };

        const mainWork = addTimeRange(startTime, firstEndTime || secondEndTime || '');
        const firstBreak = addTimeRange(firstEndTime, firstReturnTime);
        const secondWork = addTimeRange(firstReturnTime, secondEndTime);
        const secondBreak = addTimeRange(secondEndTime, secondReturnTime);

        if (firstBreak > 0) breaks.push(firstBreak);
        if (secondBreak > 0) breaks.push(secondBreak);

        const endTime = calculateEndTime(startTime, totalWorkMinutes);

        displayResult(totalWorkMinutes, endTime);
        createWorkHoursTable(startTime, firstEndTime, firstReturnTime, secondEndTime, secondReturnTime, endTime, breaks);
    }

    function getTimeDifferenceInMinutes(start, end) {
        const diff = new Date('2000-01-01T' + end) - new Date('2000-01-01T' + start);
        return Math.round(diff / 60000);
    }

    function calculateEndTime(start, totalMinutes) {
        const endTime = new Date('2000-01-01T' + start);
        endTime.setMinutes(endTime.getMinutes() + totalMinutes);
        return endTime.toTimeString().slice(0, 5);
    }

    function displayResult(totalMinutes, endTime) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        resultDiv.textContent = `סך הכל שעות עבודה: ${hours} שעות ו-${minutes} דקות. שעת סיום: ${endTime}`;
    }

    function createWorkHoursTable(start, firstEnd, firstReturn, secondEnd, secondReturn, end, breaks) {
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>כניסה</th>
                <th>יציאה</th>
                <th>משך זמן</th>
                <th>סוג</th>
            </tr>
        `;

        const addRow = (start, end, type) => {
            if (start && end) {
                const duration = getTimeDifferenceInMinutes(start, end);
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${start}</td>
                    <td>${end}</td>
                    <td>${Math.floor(duration / 60)} שעות ${duration % 60} דקות</td>
                    <td>${type}</td>
                `;
            }
        };

        addRow(start, firstEnd || secondEnd || end, 'עבודה');
        if (firstEnd) addRow(firstEnd, firstReturn, 'הפסקה');
        if (firstReturn) addRow(firstReturn, secondEnd || end, 'עבודה');
        if (secondEnd) addRow(secondEnd, secondReturn, 'הפסקה');
        if (secondReturn) addRow(secondReturn, end, 'עבודה');

        tableSection.innerHTML = '';
        tableSection.appendChild(table);
    }
});
