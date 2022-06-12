const url = "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs";
const wrapper = document.querySelector(".wrapper");
const sourceList = document.querySelector(".source-list");
const tbodyScroll = document.querySelector(".tbody-scroll");
const formSubmit = document.querySelector(".form-submit");
let updateId = null;
async function addPost({ id, title, createdAt, image, content }) {
  try {
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        createdAt,
        image,
        content,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response && response.status !== 200) {
     throw new Error("POST loi:", response.status)
    }
    let data = await response.json();
    return data;
  }catch(err) {
    console.log(err, err.message)
  }
    // .then((response) => response.json())
    // .then((json) => console.log(json));
  }
//Render
let perPage = 25;
let currentPage = 1;
let start = 0;
let end = perPage
const btnNext = document.querySelector(".btn-next")
const btnPrev = document.querySelector(".btn-prev")
const currentPages = document.querySelectorAll('.number-page li');
function getCurrentPage(currentPage) {
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage
}
async function getSource() {
 try {
   const response = await fetch(url);
   if (response && response.status !== 200) {
     throw new Error ("something Wrongs get source:" + response.status)
   }
   const data = await response.json(); 
   const product = [...data]
   console.log(product);
   let html = '';
   const content = product.map((item, index) => {
     if(index >= start && index < end) { 
       html += '<tr class="trbody">'
       html += '<td>' + item.id + '</td>'
       html += '<td>' + item.title + '</td>'
       html += '<td>' + new Date(item.createdAt).toLocaleString() + '</td>'
       html += '<td>' + item.image + '</td>'
       html += '<td>' + item.content
       html += '<button class="source-edit" data-id =' + item.id +'> <i class="fa fa-list-alt"></i></button>' 
       html += '<button class="source-remove" data-id =' + item.id + '><i class="fa fa-times"></i></button>'
       html += '</td>'
       html += '</tr>'   
       return html;     
     }
     document.getElementById("product").innerHTML = html;
   })
 }catch(err) {
   console.log(err, err.message)
}
}
getSource();

async function getClick() {
 const response = await fetch(url);
 const data = await response.json(); 
 var totalPages = Math.ceil(data.length / perPage)
 btnNext.addEventListener("click", () => {
   currentPage++;
   if(currentPage > totalPages) {
       currentPage = totalPages;
   }
   if(currentPage === totalPages) {
    btnNext.classList.add("activeFilter")
  }
    btnPrev.classList.remove("activeFilter")
    currentPages.forEach(item => {
      (item).classList.add("active");
    })
   getCurrentPage(currentPage)
   getSource();
})

btnPrev.addEventListener("click", () => {
   currentPage--;
   if(currentPage <= 1) {
       currentPage = 1;
   }
   if(currentPage === 1) {
    btnPrev.classList.add("activeFilter")
   }
    btnNext.classList.remove("activeFilter")
    currentPages.forEach(item => {
      (item).classList.add("active");
    })
   getCurrentPage(currentPage)
   getSource();
})
}
getClick();

async function renderListPage() {
  let response = await fetch(url);
  let data = await response.json();
  var totalPages = Math.ceil(data.length / perPage)
  let html = '';
  html += `<li class="btn-page-item active"><a href="#">${1}</a></li>`;
  for(let i = 2; i <= totalPages; i++) {
   html += `<li class="btn-page-item"><a href="#">${i}</a></li>`
  }
  document.getElementById('number-page').innerHTML = html;
  console.log(currentPage);
  for(let i=0 ; i < currentPages.length; i++) {
    currentPages[i].addEventListener("click", () => {
      const value = i;
      currentPage = value;
      currentPages.forEach(item => item.classList.remove('active'))
      currentPages[i].classList.add('active')
      start = (currentPage - 1) * perPage;
      end = currentPage * perPage
      getSource();
    })
  }
}
renderListPage();

wrapper.addEventListener("submit", async function (e) {
  e.preventDefault();
  const source = {
    id: this.elements["id"].value,
    title: this.elements["title"].value,
    createdAt: this.elements["createdAt"].value,
    image: this.elements["image"].value,
    content: this.elements["content"].value,
  };
  updateId ? await updateSource({id: updateId, ...source}) : await addPost(source);
  this.reset();
  await getSource();
});
//Delete
async function deleteSource(id) {
  try {
      let response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if ( response && response.status !== 200) {
        throw new Error("loi delete:", response.status)
      }   
      let data = await response.json();
      return data;
  } catch(err) {
    console.log("Loi delete:", err.message);
  }
}
async function getSingleSource(id) {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json(); 
  return data;
}

tbodyScroll.addEventListener("click", async function (e) {
  if (e.target.matches(".source-remove")) {
    const id = e.target.dataset.id;
    await deleteSource(id);
    this.reset;
    await getSource();
  } else if (e.target.matches(".source-edit")) {
    const id = e.target.dataset.id;
    const data = await getSingleSource(id);
    wrapper.elements['id'].value = data.id;
    wrapper.elements['title'].value = data.title;
    wrapper.elements['createdAt'].value = data.createdAt;
    wrapper.elements['image'].value = data.id;
    wrapper.elements['content'].value = data.id;
    formSubmit.textContent = "Update"
    updateId = id;
  }
});

// Update
 async function updateSource({id, title, createdAt, image, content}) {
  await fetch(`${url}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id,
      title,
      createdAt,
      image,
      content,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
}
