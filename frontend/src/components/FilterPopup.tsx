import React from 'react'
import FilterDropdown from './FilterDropdown'

const dateOptions = ["Older than 6 months"]

//MAKE THIS A https://ui.shadcn.com/docs/components/radix/dialog WINDOW

const FilterPopup = () => {


  return (
    <div>
      <div>
        <div>
          <p>Creator:</p>
          <FilterDropdown individualFilterOptions={dateOptions} />
        </div>
      </div>
    </div>
  )
}

export default FilterPopup
