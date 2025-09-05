// 定数の取得
const form = document.getElementById('form');
const input = document.getElementById('input');
const ul = document.getElementById('ul');
const todoCount = document.getElementById('todo-count');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  add();
});

// タスク数の更新
const updateTodoCount = () => {
  const todos = JSON.parse(localStorage.getItem('todos'));

  let completeNumber = 0;
  let incompleteNumber = 0;

  for (let todo of todos) {
    if (todo.completed) {
      completeNumber++;
    } else {
      incompleteNumber++;
    }
  }

  todoCount.innerHTML = `全てのタスク:${todos.length} 完了済み:${completeNumber} 未完了:${incompleteNumber}`;
};

// データを保存（ローカルストレージ）
const saveDate = () => {
  const lists = document.querySelectorAll('li');
  let todos = [];

  for (let list of lists) {
    let todo = {
      text: list.querySelector('span').textContent,
      completed: list.querySelector('span').classList.contains('text-decoration-line-through'),
    };
    todos.push(todo);
  }

  localStorage.setItem('todos', JSON.stringify(todos));
  updateTodoCount();
};

// TODOを追加
const add = (todo) => {
  let todoText = input.value;
  if (todo) {
    todoText = todo.text;
  }

  if (todoText) {
    // liタグ作成
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center');

    // チェックボックス作成
    const checkbox = document.createElement('input');
    checkbox.classList.add('form-check-input', 'me-2');
    checkbox.setAttribute('type', 'checkbox');

    // spanタグ作成
    const span = document.createElement('span');
    span.innerText = todoText;

    checkbox.addEventListener('click', () => {
      span.classList.toggle('text-decoration-line-through');
      saveDate();
    });

    if (todo && todo.completed) {
      span.classList.add('text-decoration-line-through');
      checkbox.checked = true;
    }

    // 編集ボタン作成
    const editBtn = document.createElement('button');
    editBtn.innerText = '編集';
    editBtn.classList.add('btn', 'btn-success', 'ms-auto');
    editBtn.addEventListener('click', () => {
      // liタグ作成
      const editLi = document.createElement('li');
      editLi.classList.add('list-group-item', 'd-flex', 'justify-content-center');

      // inputタグ作成
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = span.textContent;
      editInput.classList.add('form-control', 'w-75', 'me-2');

      // buttonタグ作成
      const editSaveBtn = document.createElement('button');
      editSaveBtn.textContent = '保存';
      editSaveBtn.type = 'submit';
      editSaveBtn.classList.add('btn', 'btn-primary');

      editLi.appendChild(editInput);
      editLi.appendChild(editSaveBtn);
      ul.replaceChild(editLi, li);

      editSaveBtn.addEventListener('click', () => {
        let newText = editInput.value;
        if (newText) {
          span.innerText = newText;
        }
        ul.replaceChild(li, editLi);
        saveDate();
      });
    });

    // 削除ボタン作成
    const delBtn = document.createElement('button');
    delBtn.innerText = '削除';
    delBtn.classList.add('btn', 'btn-danger', 'ms-1');
    delBtn.addEventListener('click', () => {
      if (confirm('本当に削除してもよろしいですか？')) {
        li.remove();
      }
      saveDate();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
    input.value = '';

    saveDate();
  }
};

// 初期化処理（保存データの読み込み）
const todos = JSON.parse(localStorage.getItem('todos'));
if (todos) {
  for (let todo of todos) {
    add(todo);
  }
}
updateTodoCount();
