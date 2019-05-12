import React from 'react'
import classnames from 'classnames'

const Suggestion = ({ currentQuestion, suggestion, answer }) => {
  const hasReplied = !!currentQuestion.answer && currentQuestion.answer.name === suggestion;
  const thisClass = classnames('Game_plant_suggestion', {
    'Game_plant_suggestion_true': hasReplied && currentQuestion.answer.value === 1,
    'Game_plant_suggestion_false': hasReplied && currentQuestion.answer.value === 0,
  })
  return (
    <div
      className={thisClass}
      onClick={() => answer(currentQuestion.type, suggestion)}
    >
      {suggestion}
    </div>
  )
}

export default Suggestion;