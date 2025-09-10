// Main SpacePicker component with compound pattern
export { SpacePicker } from './SpacePicker.js'

// Individual components
export { SpacePickerRoot } from './SpacePicker.js'
export { SpacePickerSearch } from './SpacePickerSearch.js'
export { SpacePickerViewToggle } from './SpacePickerViewToggle.js'
export { SpacePickerList } from './SpacePickerList.js'
export { SpacePickerGrid } from './SpacePickerGrid.js'
export { SpacePickerItem } from './SpacePickerItem.js'
export { SpacePickerUsageIndicator } from './SpacePickerUsageIndicator.js'
export { SpacePickerQuickActions } from './SpacePickerQuickActions.js'
export { SpacePickerEmpty } from './SpacePickerEmpty.js'
export { SpacePickerLoading } from './SpacePickerLoading.js'
export { SpacePickerError } from './SpacePickerError.js'

// Context and hooks
export { SpacePickerProvider, useSpacePickerContext } from './context/SpacePickerContext.js'
export * from './hooks/useSpacePicker.js'

// Types
export type { SpacePickerProps, SpacePickerItemProps } from '../../shared/types/spaceTypes.js'
