const form = document.getElementById("assignment-form");
const list = document.getElementById("assignment-list");

let assignments = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const due = document.getElementById("due-date").value;
  const gradeInput = document.getElementById("grade").value;
  const grade = gradeInput ? parseFloat(gradeInput) : null;

  const assignment = {
    id: Date.now(),
    title,
    due,
    grade,
    done: false
  };

  assignments.push(assignment);
  form.reset();
  renderAssignments();
});

function renderAssignments() {
  list.innerHTML = "";
  assignments.forEach((a) => {
    const row = document.createElement("tr");
    row.classList.add("assignment-row");
    if (a.done) row.classList.add("done");

    row.innerHTML = `
      <td>${a.title}</td>
      <td>${a.due}</td>
      <td>${a.grade ?? "—"}</td>
      <td>${a.done ? "Done" : "Not Done"}</td>
      <td class="actions">
        <button onclick="toggleDone(${a.id})">${a.done ? "Undo" : "Mark Done"}</button>
        <button onclick="editGrade(${a.id})">Edit Grade</button>
        <button onclick="deleteAssignment(${a.id})">Delete</button>
      </td>
    `;
    list.appendChild(row);
  });

  updateStats();
}

function toggleDone(id) {
  const a = assignments.find((a) => a.id === id);
  a.done = !a.done;
  renderAssignments();
}

function editGrade(id) {
  const newGrade = prompt("Enter new grade:");
  if (newGrade !== null) {
    const gradeVal = parseFloat(newGrade);
    if (!isNaN(gradeVal) && gradeVal >= 0 && gradeVal <= 100) {
      const a = assignments.find((a) => a.id === id);
      a.grade = gradeVal;
      renderAssignments();
    } else {
      alert("Invalid grade.");
    }
  }
}

function deleteAssignment(id) {
  assignments = assignments.filter((a) => a.id !== id);
  renderAssignments();
}

function updateStats() {
  document.getElementById("total").textContent = assignments.length;
  document.getElementById("completed").textContent = assignments.filter(a => a.done).length;

  const graded = assignments.filter(a => a.grade !== null);
  const avg = graded.reduce((sum, a) => sum + a.grade, 0) / (graded.length || 1);
  document.getElementById("average").textContent = graded.length ? avg.toFixed(1) : "N/A";
}
