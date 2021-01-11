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

// 運コメエリアの CSS
var style = document.createElement('style');
style.innerText = `
  #unei-comment-area {
    font-family: sans-serif;
    font-size: 16px;
    background: #fff;
    padding: 16px;
    margin-bottom: 16px;
  }
  #unei-comment-area > p:first-child {
    margin-top: 0;
  }
  #unei-comment-area > p:last-child {
    margin-bottom: 0;
  }`
document.head.appendChild(style);

// for comment (PIXI.js hack)
var script = document.createElement('script');
script.innerText = 'var commentTextArea = document.querySelector("#comment-text-area"); var oldText = null; var _drawLetterSpacing = PIXI.Text.prototype.drawLetterSpacing; PIXI.Text.prototype.drawLetterSpacing = function (text, x, y, isStroke) { _drawLetterSpacing.call(this, text, x, y, isStroke); if (oldText != text) { commentTextArea.value += "\\n" + text; oldText = text; commentTextArea.scrollTop = commentTextArea.scrollHeight; } };';
document.body.appendChild(script);

// 運営コメントのリンクを有効化してコピー
function copyUneicomment(commentDiv) {
  var p = document.createElement('p');
  var children = commentDiv.childNodes;

  children.forEach(child => {
    if (child.href) {
      p.appendChild(child.cloneNode(true));
    } else {
      p.append(child.textContent);
    }
  });

  return p;
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

