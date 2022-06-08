const url = "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/asdsa";
const wrapper = document.querySelector(".wrapper");
const sourceList = document.querySelector(".source-list");
const tbodyScroll = document.querySelector(".tbody-scroll");
const formSubmit = document.querySelector(".form-submit");
let updateId = null;
async function addPost({ id, title, createdAt, image, content }) {
  //dang lam
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
    if(response && response.status !== 200) {
      throw new Error('k the ket noi !' + response.status)
    }
    let data = await response.json();
    return data
    // .then((response) => response.json())
    // .then((json) => console.log(json));
  }
  // dang lam
  addPost().then(data => {
    console.log('check data:', data)
  })
    .catch(err => {
      console.log("check:", err.message)
    });

async function getSource() {
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0 && Array.isArray(data)) {
    data.forEach((item) => renderSource(item));
  }
}
getSource();

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
  await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
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

// Render
function renderSource(item) {
  const template = ` 
  <tr class="trbody">
  <td>${item.id}</td>
  <td>${item.title}</td>
  <td>${new Date(item.createdAt).toLocaleString()}</td>
  <td>${item.image}</td>
  <td>
  ${item.content}
  <button class="source-edit" data-id = ${item.id }><i class="fa fa-list-alt"></i></button>
  <button class="source-remove" data-id = ${item.id }><i class="fa fa-times"></i></button>
  </td>
</tr>
  `;
  tbodyScroll.insertAdjacentHTML("beforeend", template);
}