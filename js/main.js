'use strict'

///////////////////////////////////////////////////


const URI = 'http://imtles.noodless.co.ua';
const PER_PAGE = 5;
// login: admin
// pass: itx85A!f^&07SGM!$Z


async function getPosts(page = 1) {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerText = '';
    // запрашиваем JSON постов
    const posts_response = await fetch(`${URI}` + '/wp-json/wp/v2/posts' + `?per_page=${PER_PAGE}` + `&page=${page}`); // http://imtles.noodless.co.ua/wp-json/wp/v2/posts?per_page=2&page=1
    const posts_data = await posts_response.json();


    async function getImage(id) {
        const img_response = await fetch(`${URI}` + '/wp-json/wp/v2/media/' + `${id}`); // http://imtles.noodless.co.ua/wp-json/wp/v2/media/7
        const img_data = await img_response.json();
        return img_data;
    };

    posts_data.map(async(postItem, index) => {
        const placeholder = {
            'media_details': {
                'sizes': {
                    'thumbnail': {
                        'source_url': './images/avatar.jpg'
                    }
                }
            }
        };
        const image = postItem.featured_media ? await getImage(postItem.featured_media) : placeholder;
        const post = document.createElement('div');
        post.setAttribute('class', 'post_item')
        post.setAttribute('data-slide', index)
        const postTitle = document.createElement('h2');
        postTitle.innerHTML = postItem.title.rendered;
        const postText = document.createElement('p');
        postText.innerHTML = postItem.content.rendered;
        const date = new Date(postItem.date);
        const postDate = document.createElement('p');
        postDate.innerHTML = `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
        const postImage = document.createElement('img');
        postImage.setAttribute('src', `${image.media_details.sizes.thumbnail.source_url}`);
        postImage.setAttribute('class', `post_img`);
        post.appendChild(postImage);
        const btns = document.createElement('button');
        btns.setAttribute('value', postItem.id);
        btns.setAttribute('class', 'post_btn');
        btns.setAttribute('onclick', `getPost(${btns.value})`);
        btns.innerText = 'Read more...';
        const dotsWrap = document.querySelector('.dots');
        const dotsItem = document.createElement('div');
        dotsItem.setAttribute('class', 'dots_item')
        dotsItem.setAttribute('data-dot', index);
        postsDiv.appendChild(post);
        dotsWrap.appendChild(dotsItem)
        post.appendChild(postTitle);
        post.appendChild(postText);
        post.appendChild(postDate);
        post.appendChild(btns)

        dotsItem.addEventListener('click', clickDots)
        return postsDiv;
    });

    const postsArray = document.getElementsByClassName('post_item');
    const dotsArray = document.getElementsByClassName('dots_item');
    postsArray[0].classList.add('active');
    dotsArray[0].classList.add('active_dot');

    return posts_data;
};
getPosts();

const getPost = async(id) => {
    const post_response = await fetch(`${URI}` + '/wp-json/wp/v2/posts/' + `${id}`); // http://imtles.noodless.co.ua/wp-json/wp/v2/posts/10
    const post_data = await post_response.json();
    const placeholder = {
        'media_details': {
            'sizes': {
                'thumbnail': {
                    'source_url': './images/avatar.jpg'
                }
            }
        }
    };
    async function getImage(id) {
        const img_response = await fetch(`${URI}` + '/wp-json/wp/v2/media/' + `${id}`); // http://imtles.noodless.co.ua/wp-json/wp/v2/media/7
        const img_data = await img_response.json();
        return img_data;
    };
    const image = post_data.featured_media ? await getImage(post_data.featured_media) : placeholder;
    const thisP = document.getElementById('pop_up-wrap');
    thisP.style.display = 'flex';
    const postImage = document.createElement('img');
    postImage.setAttribute('src', `${image.media_details.sizes.thumbnail.source_url}`);
    postImage.setAttribute('class', `post_img`);
    const post = document.createElement('div');
    const close = document.createElement('div');
    const closeImg = document.createElement('img')
    close.setAttribute('class', 'close_btn');
    closeImg.setAttribute('src', './images/close_btn.jpg');
    close.appendChild(closeImg)
    const postTitle = document.createElement('h2');
    postTitle.innerHTML = post_data.title.rendered;
    const postText = document.createElement('p');
    postText.innerHTML = post_data.content.rendered;
    const date = new Date(post_data.date);
    const postDate = document.createElement('p');
    postDate.innerHTML = `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    thisP.appendChild(post);
    post.appendChild(close);
    post.appendChild(postImage);
    post.appendChild(postTitle);
    post.appendChild(postText);
    post.appendChild(postDate);
    close.addEventListener('click', () => {
        thisP.innerHTML = '';
        thisP.style.display = 'none';

        sliderInterval = null;
        sliderInterval = setInterval(click, 3000);
    });

    clearInterval(sliderInterval)

};

const prevBtn = document.querySelector('.prev_arrow');
const nextBtn = document.querySelector('.next_arrow');
let click = function() {
    const posts = document.querySelector('.all_posts');
    const currEl = document.querySelector('.active');
    const currElDots = document.querySelector('.active_dot');
    const dots = document.querySelector('.dots');

    if (!posts.lastElementChild.classList.contains('active')) {
        currEl.nextElementSibling.classList.add('active');
        currEl.classList.remove('active');
    };
    if (!dots.lastElementChild.classList.contains('active_dot')) {
        currElDots.nextElementSibling.classList.add('active_dot');
        currElDots.classList.remove('active_dot');
    }
    if (posts.lastElementChild.getAttribute('data-slide') === currEl.getAttribute('data-slide')) {
        posts.firstElementChild.classList.add('active');
        posts.lastElementChild.classList.remove('active');
    };
    if (dots.lastElementChild.getAttribute('data-dot') === currElDots.getAttribute('data-dot')) {
        dots.firstElementChild.classList.add('active_dot');
        dots.lastElementChild.classList.remove('active_dot');
    };
}

nextBtn.addEventListener('click', click);

prevBtn.addEventListener('click', function() {
    const posts = document.querySelector('.all_posts');
    const currEl = document.querySelector('.active');
    const currElDots = document.querySelector('.active_dot');
    const dots = document.querySelector('.dots')

    if (!posts.firstElementChild.classList.contains('active')) {
        currEl.previousElementSibling.classList.add('active');
        currEl.classList.remove('active');
    };

    if (!dots.firstElementChild.classList.contains('active_dot')) {
        currElDots.previousElementSibling.classList.add('active_dot');
        currElDots.classList.remove('active_dot');
    };
    if (posts.firstElementChild.getAttribute('data-slide') === currEl.getAttribute('data-slide')) {
        posts.lastElementChild.classList.add('active');
        posts.firstElementChild.classList.remove('active');
    };

    if (dots.firstElementChild.getAttribute('data-dot') === currElDots.getAttribute('data-dot')) {
        dots.lastElementChild.classList.add('active_dot');
        dots.firstElementChild.classList.remove('active_dot');
    };
});
let sliderInterval = setInterval(click, 3000);

function clickDots() {
    const post = document.querySelector('.active');
    post.classList.remove('active')
    const currElDot = document.querySelector('.active_dot');
    currElDot.classList.remove('active_dot');
    this.classList.add('active_dot');
    const dotValue = this.getAttribute('data-dot');
    const getItemAttr = document.querySelectorAll(`[data-slide="${dotValue}"]`);
    getItemAttr[0].classList.add('active');
};