import { KeyboardHandler } from '@udecode/plate-core';
import { getNextWrappingIndex } from './utils/getNextWrappingIndex';
import { comboboxStore, getComboboxStoreById } from './combobox.store';

/**
 * If the combobox is open, handle:
 * - down (next item)
 * - up (previous item)
 * - escape (reset combobox)
 * - tab, enter (select item)
 */
export const getComboboxOnKeyDown = (): KeyboardHandler => (editor) => (
  event
) => {
  const { itemIndex, filteredItems, activeId } = comboboxStore.get.state();
  const isOpen = comboboxStore.get.isOpen();

  if (!isOpen) return;

  const store = getComboboxStoreById(activeId);
  if (!store) return;

  const onSelectItem = store.get.onSelectItem();

  if (event.key === 'ArrowDown') {
    event.preventDefault();

    const newIndex = getNextWrappingIndex(
      1,
      itemIndex,
      filteredItems.length,
      () => {},
      true
    );
    comboboxStore.set.itemIndex(newIndex);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();

    const newIndex = getNextWrappingIndex(
      -1,
      itemIndex,
      filteredItems.length,
      () => {},
      true
    );
    comboboxStore.set.itemIndex(newIndex);
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    comboboxStore.set.reset();
    return;
  }

  if (['Tab', 'Enter'].includes(event.key)) {
    event.preventDefault();
    if (filteredItems[itemIndex]) {
      onSelectItem?.(editor, filteredItems[itemIndex]);
    }
  }
};
