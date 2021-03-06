const goodbye = require('./goodbye.js');
const love = require('./love.js');
const feedback = require('./feedback.js');
const thanks = require('./thanks.js');
const howAreYou = require('./howAreYou.js');

exports.getMessages = text => {
  var messages = [];
  if (
    (message = goodbye.getGoodbyeMessage(text)) ||
    (message = love.getLoveMessage(text)) ||
    (message = feedback.getFeedbackMessage(text)) ||
    (message = howAreYou.getHowAreYouMessage(text)) ||
    (message = thanks.getThanksMessage(text))
  )
    messages.push(message);
  return messages;
}