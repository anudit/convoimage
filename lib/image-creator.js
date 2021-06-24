import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/micah";

const isDev = process.env.NODE_ENV === 'development';

const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser-Dev\\Application\\brave.exe'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';


export const getOptions = async (isDev) => {
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  }
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
};

const renderHead = () => {
  return `
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #00DBDE;
          background-image: linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%);
          padding: 82px;
          font-size: 38px;
          font-family: 'Roboto', sans-serif;
          width: 1920px;
          height: 1080px;
          display: flex;
        }

        .post-image-wrapper {
          background-color: white;
          border: 2px solid black;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          padding: 32px 42px;
          box-shadow: 12px 12px 0 black;
          margin: 0 auto;
          padding-top: 62px;
          flex-direction: column;
          display: flex;
          justify-content: center;
          align-content: space-around;
        }

        .post-image-title {
          font-size: 3em;
        }

        .post-image-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 132px;
        }

        .post-image-footer-left {
          display: flex;
          align-items: center;
        }

        .post-image-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          padding: 1px;
          margin-right: 10px;
        }

        .post-image-dot {
          margin: 0 12px;
        }

        .post-image-badge {
          width: 64px;
          height: 64px;
          object-fit: cover;
        }
      </style>
    </head>
  `;
};

const renderBody = (post) => {
  const { title, author, creation_time } = post;
  const avatar = createAvatar(style, {
      author,
      mouth: ['laughing', 'smile'],
      dataUri: true
  });

  return `
    <body>
      <div class="post-image-wrapper">
        <div class="post-image-header">
          <h1 class="post-image-title">${title.length > 100 ? title.slice(0, 100) + '...' : title}</h1>
        </div>

        <div class="post-image-footer">
          <div class="post-image-footer-left">
            <img src="${avatar}" alt="Avatar" class="post-image-avatar" />
            <span class="post-image-author">By ${author},</span>
            <span class="post-image-dot"></span>
            <span class="">${creation_time}</span>
          </div>

          <div class="post-image-footer-right">
            <div class="post-image-badges">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 512 512" class="post-image-badge">
                  <path fill="#010101" d="M359 383H81c-3 0-5-1-7-4L5 259c-2-3-2-5 0-8l13-23c1-2 3-3 5-3h463c5 0 7 1 9 5l12 22c2 2 2 4 0 6l-15 27c-2 3-4 5-9 5l-218-1H102l16 29c1 2 3 2 4 2h350l-20 35-67 114c-2 4-4 5-8 5H135c-3 0-5 1-7-2l-34-59h242c4 0 7-1 9-5l14-25zM37 195l65-112 23-41c2-3 4-4 8-4h246c3 0 5 0 6 2l35 61H174c-4 0-6 1-8 5l-14 25h280c4 0 7 1 9 5l33 59H37z"/>
                </svg>
              </div>
          </div>
        </div>
      </div>
    </body>
  `;
};

const getImageHtml = (post) => {
  return `
    <html lang="en">
      ${renderHead()}
      ${renderBody(post)}
    </html>
  `;
};

const createImage = async (post) => {
  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  try {
    await page.setContent(getImageHtml(post), { waitUntil: "domcontentloaded" });

    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true, type: "jpeg" });

    return imageBuffer;
  } catch (error) {
    return '';
  } finally {
    await browser.close();
  }
};

module.exports = {
  createImage,
};
