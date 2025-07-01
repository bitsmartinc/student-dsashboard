/**
 * {
 *  title: String;
 *  dueDate : Date;
 *  grade: Number;
 *  done : Boolean;
 * }
 */

const assignmentsAsSt = localStorage.getItem('assignments');

const assignments = assignmentsAsSt ? JSON.parse(assignmentsAsSt) : [];

assignments.forEach(assignment => {
    assignment.dueDate = new Date(assignment.dueDate)
});

document.addEventListener('DOMContentLoaded', function (){

    syncPage();

    //find the form element
    const formElement = document.querySelector('#assignment-form');
    
    formElement.addEventListener('submit', function(event){
        event.preventDefault();

        const titleElement = document.querySelector('#title');
        const titleValue = titleElement.value;

        //find the input element for due date
        const dueDateElement = document.querySelector('#due-date');
        const dueDateValue = dueDateElement.value;

        const dueDateValueAsDate = new Date(dueDateValue);

        const gradeElement = document.querySelector('#grade');
        const gradeValue = gradeElement.value;

        const gradeValueAsNumber = Number(gradeValue);

        const assignment = {
            title : titleValue,
            dueDate : dueDateValueAsDate,
            grade : gradeValueAsNumber
        };

        assignments.push(assignment);

        formElement.reset();

        syncPage();
    });
});

function renderAssignments(){
    const tbodyElement = document.querySelector('#assignment-list');

    tbodyElement.innerHTML = '';
    assignments.forEach(function (assignment, index){
        const rowElement = document.createElement('tr');
        rowElement.classList.add('assignment-row');
        rowElement.id = `assignment-${index}`;

        rowElement.innerHTML = `
            <td>${assignment.title}</td>
            <td>${new Intl.DateTimeFormat("en-US").format(assignment.dueDate)}</td>
            <td>${assignment.grade}</td>
            <td>${assignment.done ? 'Done' : 'Not Done'}</td>
            <td>
                <button onclick="toggleDone(${index})" class="mark-done-btn">
                    Mark ${assignment.done ? 'Not Done' : 'Done'}
                </button>
                <button class="dlt-btn" onclick="deleteAsst(${index})">
                    Delete
                </button>
                <button onclick="editGrade(${index})" class="edit-grade-btn">
                    Edit Grade
                </button>
            </td>`;

        tbodyElement.appendChild(rowElement);
        
    });

    
    
}

function toggleDone(index){
    assignments[index].done = !assignments[index].done;
    syncPage();
}

function deleteAsst(index){
    assignments.splice(index, 1);

    syncPage();
}

function editGrade(index){
    const newValue = prompt("Enter new Grade");
    assignments[index].grade = Number(newValue);
    syncPage();
}

function renderStats(){
    //find the total element
    const totalElement = document.querySelector('#total');
    const totalValue = assignments.length;

    totalElement.innerHTML = totalValue;

    //find the completed element
    const completedElement = document.querySelector('#completed');
    const completedValue = assignments.reduce(function(acc, assignment){
        return acc + (assignment.done ? 1 : 0);
    }, 0);

    completedElement.innerHTML = completedValue;

    //find the average element
    const averageElement = document.querySelector('#average');

    const sumGradesValue = assignments.reduce(function (acc, assignment) {
        return acc + assignment.grade;
    }, 0);
    
    const averageValue = sumGradesValue / assignments.length;

    averageElement.innerHTML = averageValue.toFixed(2);
}

function saveDataToStorage(){
    const assignmentsAsString = JSON.stringify(assignments);
    localStorage.setItem('assignments', assignmentsAsString);
}

function syncPage(){
    renderAssignments();
    renderStats();
    saveDataToStorage();
}