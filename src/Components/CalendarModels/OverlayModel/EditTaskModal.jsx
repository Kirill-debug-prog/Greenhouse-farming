import React from 'react'
import InputSymbol from '../../Input/InputSymbol/InputSymbol'
import ButtonOverlay from '../../Button/ButtonOverlay/ButtonOverlay'
import './OverlayModel.css'

export default function EditTaskModal({
  selectedDate,
  selectedEvent,
  onClose,
  onSave
}) {
  const getTaskTitle = (type) => {
    switch (type) {
      case 'посев':
        return 'Редактирование задачи посева'
      case 'удобрение':
        return 'Редактирование задачи удобрения'
      case 'полив':
        return 'Редактирование задачи полива'
      default:
        return 'Редактирование задачи'
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-overlay-creating-task'>
        <div className='modal-tile'>
          <span className='text size-text_title'>{getTaskTitle(selectedEvent.type)}</span>
          <span className='text size-text_basic position'>Дата: {selectedDate}</span>
          <span className='text position'>Культура: Томаты</span>

          <div className='date-container'>
            {/* Посев */}
            {selectedEvent.type === 'посев' && (
              <div className='container-input'>
                <label htmlFor='count' className='caption'>Количество</label>
                <InputSymbol id='count' placeholder='Посадочного материала (кг)' type='number' />
              </div>
            )}

            {/* Удобрение */}
            {selectedEvent.type === 'удобрение' && (
              <>
                <div className='container-input'>
                  <label htmlFor='dose' className='caption'>Дозировка</label>
                  <InputSymbol id='dose' placeholder='Дозировка (кг)' type='number' />
                </div>
                <div className='container-input'>
                  <label htmlFor='type' className='caption'>Тип удобрения</label>
                  <InputSymbol id='type' placeholder='Тип удобрения' type='text' />
                </div>
                <div className='container-input'>
                  <label htmlFor='method' className='caption'>Способ внесения</label>
                  <InputSymbol id='method' placeholder='Способ внесения' type='text' />
                </div>
              </>
            )}

            {/* Полив */}
            {selectedEvent.type === 'полив' && (
              <>
                <div className='container-input'>
                  <label htmlFor='volume' className='caption'>Объём воды</label>
                  <InputSymbol id='volume' placeholder='Объём воды (л)' type='number' />
                </div>
                <div className='container-input'>
                  <label htmlFor='method' className='caption'>Метод полива</label>
                  <InputSymbol id='method' placeholder='Метод полива' type='text' />
                </div>
              </>
            )}

            {/* Общие поля */}
            <div className='container-input'>
              <label htmlFor='start' className='caption'>Время начала</label>
              <InputSymbol id='start' type='time' />
            </div>
            <div className='container-input'>
              <label htmlFor='end' className='caption'>Время окончания</label>
              <InputSymbol id='end' type='time' />
            </div>
          </div>

          <div className='conteiner-button'>
            <ButtonOverlay className='button-blue' onClick={onSave}>Сохранить</ButtonOverlay>
            <ButtonOverlay className='button-red' onClick={onClose}>Отмена</ButtonOverlay>
          </div>
        </div>
      </div>
    </div>
  )
}
