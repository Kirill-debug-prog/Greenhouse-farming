import React from 'react'
import ButtonOverlay from '../../Button/ButtonOverlay/ButtonOverlay'
import './OverlayModel.css'

export default function DeleteModal({ isOpen, onClose, selectedEvent }) {
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
          <span className='text size-text_title'>Удалить задачу {getTaskTitle(selectedEvent.type)}?</span>
          <div className='conteiner-button'>
            <ButtonOverlay className='button-blue' onClick={onClose}>Да</ButtonOverlay>
            <ButtonOverlay className='button-red' onClick={onClose}>Нет</ButtonOverlay>
          </div>
        </div>
      </div>
    </div>
  )
}
