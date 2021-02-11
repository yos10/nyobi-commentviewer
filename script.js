'use strict';
// create comment area
var commentTextArea = document.querySelector('#comment-text-area');
if (!commentTextArea) {
  var column = document.querySelector('#root > div > div > div > div > div');
  var div = document.createElement('div');
  commentTextArea = document.createElement('textarea');
  commentTextArea.style = 'width:100%;height:6em;';
  commentTextArea.id = 'comment-text-area';
  div.appendChild(commentTextArea);
  column.appendChild(div);
}

// 右カラムに運コメエリアをつくる
var uncommeArea = document.querySelector('#unei-comment-area');
if (!uncommeArea) {
  var column = document.querySelector('#root > div > div:nth-child(2) > div:nth-child(2)');
  var uncommeArea = document.createElement('div');
  uncommeArea.style = 'width:100%;max-height:50vh;overflow-y:scroll;';
  uncommeArea.id = 'unei-comment-area';
  column.prepend(uncommeArea);
}

// 右カラムに運コメをコピーするボタンをつくる
var copyUncommeButton = document.querySelector('#copy-uncomme-button');
if (!copyUncommeButton) {
  var div = document.createElement('div');
  div.setAttribute('class', 'copy-uncomme-button');
  copyUncommeButton = document.createElement('button');
  copyUncommeButton.id = 'copy-uncomme-button';
  copyUncommeButton.textContent = '運営コメントをクリップボードへコピー';
  div.appendChild(copyUncommeButton)
  uncommeArea.after(div);
}

// 運営コメントをコピー
function copyUncommeToClipboard() {
  // var uncommeArea = document.querySelector('#unei-comment-area');
  var children = uncommeArea.childNodes;
  var copyText = '';
  children.forEach(child => {
    copyText += child.textContent + '\n';
  });
  navigator.clipboard.writeText(copyText);
}
document.querySelector('#copy-uncomme-button').addEventListener('click', copyUncommeToClipboard);

// 運コメエリアとコピーボタンのCSS
var style = document.createElement('style');
style.innerText = `
  #unei-comment-area {
    font-family: sans-serif;
    font-size: 16px;
    background: #fff;
    padding: 0 16px 0;
  }
  #unei-comment-area > div:last-child > p {
    margin-bottom: 0;
  }
  #unei-comment-area time {
    margin-right: 16px;
  }
  .copy-uncomme-button {
    display: flex;
    justify-content: center;
    background: white;
    margin-bottom:  16px;
  }
  #copy-uncomme-button {
    appearance: none;
    font-family: sans-serif;
    font-size: 1.4rem;
    line-height: 1;
    box-sizing: border-box;
    background: rgb(79, 115, 227);
    border: 1px solid rgb(79, 115, 227);
    border-radius: 4px;
    color: rgb(255, 255, 255);
    cursor: pointer;
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 16px 40px;
    outline: none;
    width: 320px;
  }
  #copy-uncomme-button:hover {
    border: 1px solid rgb(79, 115, 227);
    filter: brightness(130%);
  }`
document.head.appendChild(style);

// for comment (PIXI.js hack)
var script = document.createElement('script');
script.innerText = 'var commentTextArea = document.querySelector("#comment-text-area"); var oldText = null; var _drawLetterSpacing = PIXI.Text.prototype.drawLetterSpacing; PIXI.Text.prototype.drawLetterSpacing = function (text, x, y, isStroke) { _drawLetterSpacing.call(this, text, x, y, isStroke); if (oldText != text) { commentTextArea.value += "\\n" + text; oldText = text; commentTextArea.scrollTop = commentTextArea.scrollHeight; } };';
document.body.appendChild(script);

// 運営コメントのリンクの XSS に対応するための関数
// via https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 運営コメントのリンクを有効化してコピー
function copyUneicomment(commentDiv) {
  var div = document.createElement('div');
  var p = document.createElement('p');
  var a = document.createElement('a');
  var videoTime = document.querySelector('time').cloneNode(true);
  var children = commentDiv.childNodes;

  children.forEach(child => {
    p.prepend(videoTime);
    if (child.nodeName === 'A') {
      var urlInComment = child.href;
       // リンク先が http:// か https:// ではじまらない場合、文字列だけ表示
      if (!urlInComment.match(/^https?:\/\//)) {
        p.append(urlInComment);
        return;
      }
      a.href = escapeHtml(urlInComment);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = urlInComment;
      p.appendChild(a);
    } else {
      p.append(child.textContent);
      div.append(p);
    }
  });

  return div;
}

// for lesson interaction comment
var commentText = null;
var uncomme = null;
function updateCommentIfChange(commentDiv) {
  if (commentText !== commentDiv.innerText) {
    commentDiv.addEventListener('DOMNodeRemoved', handleMutations) ;
    commentText = commentDiv.innerText;
    uncomme = copyUneicomment(commentDiv);
    if(commentText) {
      commentTextArea.value += '\n運営: ' + commentText;
      commentTextArea.scrollTop = commentTextArea.scrollHeight;
      // 右カラムに運営コメントを表示させる。
      uncommeArea.appendChild(uncomme);
      uncommeArea.scrollTop = uncommeArea.scrollHeight;
    }
  }
}

function handleMutations(mutations) {
  var commentDiv = document.querySelector('#root > div > div > div > div > div > div > div > div > div > div');
  if (commentDiv) {
    updateCommentIfChange(commentDiv);
  }
}
var observer = new MutationObserver(handleMutations);
var config = { attributes: true, childList: true, characterData: true, subtree: true };
observer.observe(document.querySelector('#root > div > div > div > div > div > div > div'), config);
