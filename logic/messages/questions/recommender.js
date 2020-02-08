const logger = require('../../../logger.js');
const preprocessor = require('../../preprocessor.js');
const constants = require('./recommender.constants');
const mealRecommender = require('./recommendations/meal.js');

exports.getRecommendationMessage = text => {
  text = preprocessor.removeNonAlphanumeric(text);
  var questionTypeString = `(${constants.questionTypes.join('|')})`;
  var auxiliaryString = `(${constants.auxiliaries.join('|')})`;
  var queryPattern = new RegExp(
    `${questionTypeString}([A-z ]*) ${auxiliaryString} [A-z]+ ([A-z]+)(.*)`, "i"
  )
  var matches = text.match(queryPattern);
  if (!matches) {
    return "";
  }

  var type = matches[1];
  var object = matches[2];
  var action = matches[4];
  var details = matches[5];

  var messages = [];
  messages.push(tryMatchMeal(type, object, action, details));

  messages = messages.filter(message => message);
  if (messages.length > 0)
    return messages[0];
  return "";
}

const DEFAULT_MEAL_TYPE = "lunch";
const tryMatchMeal = (type, object, action, details) => {
  if (type.match(/what/i)) {
    if (action.match(/eat/i) || constants.causatives.includes(action)) {
      if (mealRecommender.doDetailsMatchThisModule(details)) {
        return mealRecommender.getMealRecommendationMessage(details);
      } else if (mealRecommender.doDetailsMatchThisModule(object)) {
        return mealRecommender.getMealRecommendationMessage(object)
      } else if (action.match(/eat/i)) {
        return mealRecommender.getMealRecommendationMessage(DEFAULT_MEAL_TYPE);
      }
    } else if (action.match(/drink/i)) {
      if (object.match(/alcohol/i)) {
        return mealRecommender.getMealRecommendationMessage("alcohol");
      } else {
        return mealRecommender.getMealRecommendationMessage(action);
      }
    }
  }
  return "";
};
