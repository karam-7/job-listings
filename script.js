const main = document.querySelector('.main');
const head = main.querySelector('.head');
const clearBtn = document.querySelector('.clear');
const job = document.querySelector('.job');

let filterArray = [];
getData();

clearBtn.addEventListener('click', clearBtnHandler);


async function getData() {
  const res = await fetch('data.json');
  const response = await res.json();

  response.forEach(res => {
    const {
      company, contract, logo, location, level, position, role,
      postedAt, featured, new:recent, tools, languages:lang, id,
    } = res;

    const li = document.createElement('li');
    li.className = 'account card';
    li.id = id;
    li.innerHTML = `
      <div class="profile">
        <img src="${logo}" alt="image" class="profile-img">
        <div class="profile-info">
          <div class="row flex" id="rowTxts">
            <p class="name">${company}</p>
            <p class="tag blue">${recent ? 'New!' : ''}</p>
            <p class="tag black">${featured ? 'Featured' : ''}</p>
          </div>
          <h3>${position}</h3>
          <div class="row">
            <small>${postedAt} <span>.</span></small>
            <small>${contract} <span>.</span></small>
            <small>${location}</small>
          </div>
        </div>
      </div>
      <div class="skillset flex">
        <p class="para" data-role="${role}">${role}</p>
        <p class="para" data-lev="${level}">${level}</p>
        <p class="para" data-lang="${lang[0]}">${lang[0] ? lang[0] : ''}</p>
        <p class="para" data-lang="${lang[1]}">${lang[1] ? lang[1] : ''}</p>
        <p class="para" data-lang="${lang[2]}">${lang[2] ? lang[2] : ''}</p>
        <p class="para" data-tool="${tools[0]}">${tools[0] ? tools[0] : ''}</p>
        <p class="para" data-tool="${tools[1]}">${tools[1] ? tools[1] : ''}</p>
      </div>
    `;
    job.appendChild(li);
    removeEmptyTags(li);
  });

  const pTags = document.querySelectorAll('.para');
  pTags.forEach(p => p.addEventListener('click', () => tagHandler(p)));
}


/* EVENT-HANDLER FUNCTIONS */

function tagHandler(target) {
  const filter = target.innerText;

  const dataObj = target.dataset;
  const name = Object.keys(dataObj);
  const paras = document.querySelectorAll(`[data-${name}]`);
 
  paras.forEach(p => {
    if(p.innerText === filter) {
      p.classList.add('active');
    }
  });

  activateFilter(filter);
  filterListItems();
}


function removeFilterHandler(elem) {
  const paras = document.querySelectorAll('p');
  elem.remove();

  const text = elem.innerText.trim();
  const idx = filterArray.findIndex(item => {
    return item === text;
  });
 
  filterArray.splice(idx, 1);
  filterListItems();
 
  paras.forEach(p => {
    if(p.innerText === text) {
      p.classList.remove('active');
    }
  });
 
  if(head.innerHTML === '') {
    main.classList.remove('active');
  }
}


function clearBtnHandler() {
  const lists = document.querySelectorAll('li');
  const paras = document.querySelectorAll('p');

  head.innerHTML = '';
  filterArray = [];
  main.classList.remove('active');
 
  lists.forEach(li => {
    li.classList.remove('hide');
  });
  paras.forEach(p => {
    p.classList.remove('active');
  });
}


/* LOGICS & HELPER FUNCTIONS */

function removeEmptyTags(list) {
  const tags = list.querySelectorAll('.tag');
  const paras = list.querySelectorAll('.para');

  tags.forEach(tag => {
    if(tag.innerHTML === '') {
      tag.remove();
    }
    if(tag.innerHTML === 'Featured') {  
      list.classList.add('active');
    }
  });

  paras.forEach(p => {
    if(p.innerHTML === '') {
      p.remove();
    }
  });
}


function activateFilter(data) {
  if(filterArray.includes(data)) { return; }

  main.classList.add('active');

  const  filterElem = document.createElement('div');
  filterElem.className = 'filter flex';
  filterElem.innerHTML = `
    <p class="filter-txt para">${data}</p>
    <div class="remove"></div>
  `;

  head.appendChild(filterElem);
  filterArray.push(data);

  const remove = filterElem.lastElementChild;
  remove.addEventListener('click', () => removeFilterHandler(filterElem));
}


function filterListItems() {
  const lists = document.querySelectorAll('li');

  for(let i = 0; i < lists.length; i++) {
    lists[i].classList.add('hide');
  }

  const set = new Set(filterArray);
  const arr = [...set];

  for(let j = 0; j < lists.length; j++) {
    const roles = lists[j].querySelectorAll('[data-role]');
    const levels = lists[j].querySelectorAll('[data-lev]');
    const langs = lists[j].querySelectorAll('[data-lang]');
    const tools = lists[j].querySelectorAll('[data-tool]');

    const listItems = pushItemsToArray([roles, levels, langs, tools]);

    const boolean = arr.every(item => {
      return listItems.includes(item);
    });

    if(boolean) {
      lists[j].classList.remove('hide');
    }
  }
}


function pushItemsToArray(arr) {
  const arrayOfTexts = [];

  for(let i = 0; i < arr.length; i++) {
    arr[i].forEach(item => {
      arrayOfTexts.push(item.innerText);
    });
  }

  return arrayOfTexts;
}