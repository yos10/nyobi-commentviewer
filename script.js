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

// for comment (PIXI.js hack)
var script = document.createElement('script');
script.innerText =
  'var commentTextArea = document.querySelector("#comment-text-area"); var oldText = null; var _drawLetterSpacing = PIXI.Text.prototype.drawLetterSpacing; PIXI.Text.prototype.drawLetterSpacing = function (text, x, y, isStroke) { _drawLetterSpacing.call(this, text, x, y, isStroke); if (oldText != text) { commentTextArea.value += "\\n" + text; oldText = text; commentTextArea.scrollTop = commentTextArea.scrollHeight; } };';
document.body.appendChild(script);

// for lesson interaction comment
var commentText = null;
function updateCommentIfChange(commentDiv) {
  if (commentText !== commentDiv.innerText) {
    commentText = commentDiv.innerText;
    if (commentText) {
      commentTextArea.value += '\n運営: ' + commentText;
      commentTextArea.scrollTop = commentTextArea.scrollHeight;
    }
  }
}

// 動画上部の運営コメントが表示されている部分
const targetNode = document.querySelector(
  '#root > div > div > div > div > div > div:nth-child(1) > div > div:nth-child(1)'
);
const config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
};

const callback = (mutationsList, observe) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      updateCommentIfChange(targetNode);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
