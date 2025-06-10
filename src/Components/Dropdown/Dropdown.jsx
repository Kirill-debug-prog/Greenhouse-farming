import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import './Dropdown.css'

export default function Dropdown({
  options = [],
  placeholder = 'Выберите значение',
  value,
  onChange,
  getOptionLabel = (option) => {
    if (typeof option === 'string' || typeof option === 'number') return option;
    if (option && typeof option === 'object') {
      return option.greenhouseName || option.name || JSON.stringify(option);
    }
    return '';
  },
  getOptionKey = (option, index) => index
}) {
  return (
    <div className="dropdown-container">
      <Listbox value={value} onChange={onChange}>
        <div style={{ position: 'relative' }}>
          <Listbox.Button className="dropdown-button">
            <span className="dropdown-button-text">
              {value ? getOptionLabel(value) : placeholder}
            </span>
            <span className="chevron-icon">
              <ChevronUpDownIcon />
            </span>
          </Listbox.Button>
          <Listbox.Options className="dropdown-options">
            {options.map((item, index) => (
              <Listbox.Option
                key={getOptionKey(item, index)}
                value={item}
                className={({ active, selected }) =>
                  `dropdown-option ${active ? 'active' : ''} ${selected ? 'selected' : ''}`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`dropdown-option-text ${selected ? 'selected' : ''}`}>
                      {getOptionLabel(item)}
                    </span>
                    {selected && (
                      <span className="check-icon">
                        <CheckIcon />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}
