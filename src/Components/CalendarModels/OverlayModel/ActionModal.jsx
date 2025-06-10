import React from 'react'
import ButtonOverlay from '../../Button/ButtonOverlay/ButtonOverlay'
import './OverlayModel.css'
import cross from'../../../assets/close.svg'

export default function ActionModal({ isOpen, selectedDate, onEdit, onDelete, onClose, selectedEvent}) {
  if (!isOpen) return null

   const getTaskTitle = (type) => {
    switch (type) {
      case 'посев':
        return 'посева'
      case 'удобрение':
        return 'удобрения'
      case 'полив':
        return 'полива'
      default:
        return ''
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-overlay-creating-task'>
        <div className='modal-tile'>
          <span className='text size-text_title'>Выберите действие для задачи {getTaskTitle(selectedEvent.type)}</span>
          <span className='text size-text_basic position'>Дата: {selectedDate}</span>
          <div className='conteiner-button'>
            <ButtonOverlay className='button-blue' onClick={onEdit}>Редактировать</ButtonOverlay>
            <ButtonOverlay className='button-red' onClick={onDelete}>Удалить</ButtonOverlay>
          </div>
        </div>
        <img className='cross' src={cross} alt='Закрыть' onClick={onClose}/>
      </div>
    </div>
  )
}
