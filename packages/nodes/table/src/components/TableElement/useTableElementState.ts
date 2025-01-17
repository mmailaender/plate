import {
  getPluginOptions,
  useElement,
  usePlateEditorRef,
} from '@udecode/plate-common';
import { ELEMENT_TABLE } from '../../createTablePlugin';
import { useTableStore } from '../../stores/tableStore';
import { TablePlugin, TTableElement } from '../../types';
import { useTableColSizes } from './useTableColSizes';

export interface TableElementState {
  colSizes: number[];
  isSelectingCell: boolean;
  minColumnWidth: number;
  marginLeft: number;
}

export const useTableElementState = ({
  transformColSizes,
}: {
  /**
   * Transform node column sizes
   */
  transformColSizes?: (colSizes: number[]) => number[];
} = {}): TableElementState => {
  const editor = usePlateEditorRef();

  const { minColumnWidth, disableMarginLeft } = getPluginOptions<TablePlugin>(
    editor,
    ELEMENT_TABLE
  );

  const element = useElement<TTableElement>();
  const selectedCells = useTableStore().get.selectedCells();
  const marginLeftOverride = useTableStore().get.marginLeftOverride();

  const marginLeft = disableMarginLeft
    ? 0
    : marginLeftOverride ?? element.marginLeft ?? 0;

  let colSizes = useTableColSizes(element);

  if (transformColSizes) {
    colSizes = transformColSizes(colSizes);
  }

  // add a last col to fill the remaining space
  if (!colSizes.some((size) => size === 0)) {
    colSizes.push('100%' as any);
  }

  return {
    colSizes,
    isSelectingCell: !!selectedCells,
    minColumnWidth: minColumnWidth!,
    marginLeft,
  };
};
