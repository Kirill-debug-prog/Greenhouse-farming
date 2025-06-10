import React, { useState } from 'react'
import InputRadio from '../../Input/InputRadio/InputRadio'
import ButtonOverlay from '../../Button/ButtonOverlay/ButtonOverlay'
import './OverlayModel.css'

import './OverlayModel.css'
import CreateTaskModal from './CreateTaskModal'

export default function SelectTaskTypeModal({
  selectedDate,
  onClose,
  greenhouseId,
  cultureId,
}) {
  const [selectedValue, setSelectedValue] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handkeNext = () => {
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = (success) => {
    setShowCreateModal(false)
    if (success) {
      onClose()
    }
  }

  return (
    <>
    <div className="modal-overlay">
      <div className="modal-overlay-choose-PR">
        <div className="modal-tile">
          <span className="text size-text_title">Выберите необходимую задачу</span>
          <span className="text size-text_date position">Дата: {selectedDate}</span>
        </div>

        <div className="radio-button">
          <InputRadio
            id="type1"
            name="reportType"
            value="sowing"
            checked={selectedValue === 'sowing'}
            onChange={() => setSelectedValue('sowing')}
            className="sowing"
          >
            Посев
          </InputRadio>

          <InputRadio
            id="type2"
            name="reportType"
            value="watering"
            checked={selectedValue === 'watering'}
            onChange={() => setSelectedValue('watering')}
            className="watering"
          >
            Полив
          </InputRadio>

          <InputRadio
            id="type3"
            name="reportType"
            value="fertilizer"
            checked={selectedValue === 'fertilizer'}
            onChange={() => setSelectedValue('fertilizer')}
            className="fertilizer"
          >
            Удобрение
          </InputRadio>
        </div>

        <div className="conteiner-button">
          <ButtonOverlay className="button-blue" onClick={handkeNext} disabled={!selectedValue}>
            Далее
          </ButtonOverlay>
          <ButtonOverlay className="button-red" onClick={onClose}>
            Отмена
          </ButtonOverlay>
        </div>
      </div>
    </div>

    {showCreateModal && (
      <CreateTaskModal
        selectedDate={selectedDate}
        selectedValue={selectedValue}
        onClose={handleCloseCreateModal}
        greenhouseId={greenhouseId}
        cultureId={cultureId}
        />
    )}
    </>
  )
}
