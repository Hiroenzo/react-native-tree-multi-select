import React from 'react';
import { InteractionManager } from 'react-native';
import type {
  TreeNode,
  TreeViewProps,
  TreeViewRef
} from './types/treeView.types';
import NodeList from './components/NodeList';
import {
  selectAll,
  selectAllFiltered,
  unselectAll,
  unselectAllFiltered,
  initializeNodeMaps,
  expandAll,
  collapseAll,
  toggleCheckboxes,
  expandNodes,
  collapseNodes
} from './helpers';
import { useTreeViewStore } from './store/treeView.store';
import usePreviousState from './utils/usePreviousState';
import { useShallow } from "zustand/react/shallow";

const _TreeView = React.forwardRef<TreeViewRef, TreeViewProps>(
  (props, ref) => {
    const {
      data,

      onCheck,
      onExpand,

      autoSelectParents = true,
      autoSelectChildren = true,

      preselectedIds = [],

      preExpandedIds = [],

      treeFlashListProps,
      checkBoxViewStyleProps,
      indentationMultiplier,

      CheckboxComponent,
      ExpandCollapseIconComponent,
      ExpandCollapseTouchableComponent,

      CustomNodeRowComponent,
    } = props;

    const {
      expanded,
      updateExpanded,

      initialTreeViewData,
      updateInitialTreeViewData,

      searchText,
      updateSearchText,

      updateSearchKeys,

      checked,
      indeterminate,

      cleanUpTreeViewStore,
    } = useTreeViewStore(useShallow(
      state => ({
        expanded: state.expanded,
        updateExpanded: state.updateExpanded,

        initialTreeViewData: state.initialTreeViewData,
        updateInitialTreeViewData: state.updateInitialTreeViewData,

        searchText: state.searchText,
        updateSearchText: state.updateSearchText,

        updateSearchKeys: state.updateSearchKeys,

        checked: state.checked,
        indeterminate: state.indeterminate,

        cleanUpTreeViewStore: state.cleanUpTreeViewStore,
      })
    ));

    React.useImperativeHandle(ref, () => ({
      selectAll,
      unselectAll,

      selectAllFiltered,
      unselectAllFiltered,

      expandAll,
      collapseAll,

      expandNodes,
      collapseNodes,

      selectNodes,
      unselectNodes,

      setSearchText
    }));

    const prevSearchText = usePreviousState(searchText);

    React.useEffect(() => {
      useTreeViewStore.setState({autoSelectParents, autoSelectChildren})

      updateInitialTreeViewData(data);

      initializeNodeMaps(data);

      // Check any pre-selected nodes
      toggleCheckboxes(preselectedIds, true);

      // Expand pre-expanded nodes
      expandNodes(preExpandedIds);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function selectNodes(ids: string[]) {
      toggleCheckboxes(ids, true);
    }

    function unselectNodes(ids: string[]) {
      toggleCheckboxes(ids, false);
    }

    function setSearchText(text: string, keys: string[] = ["name"]) {
      updateSearchText(text);
      updateSearchKeys(keys);
    }

    const getIds = React.useCallback((node: TreeNode): string[] => {
      if (!node.children || node.children.length === 0) {
        return [node.id];
      } else {
        return [node.id, ...node.children.flatMap((item) => getIds(item))];
      }
    }, []);

    React.useEffect(() => {
      onCheck?.(Array.from(checked), Array.from(indeterminate));
    }, [onCheck, checked, indeterminate]);

    React.useEffect(() => {
      onExpand?.(Array.from(expanded));
    }, [onExpand, expanded]);

    React.useEffect(() => {
      if (searchText) {
        InteractionManager.runAfterInteractions(() => {
          updateExpanded(new Set(initialTreeViewData.flatMap(
            (item) => getIds(item)
          )));
        });
      }
      else if (prevSearchText && prevSearchText !== "") {
        /* Collapse all nodes only if previous search query was non-empty: this is
        done to prevent node collapse on first render if preExpandedIds is provided */
        InteractionManager.runAfterInteractions(() => {
          updateExpanded(new Set());
        });
      }
    }, [
      getIds,
      initialTreeViewData,
      prevSearchText,
      searchText,
      updateExpanded
    ]);

    React.useEffect(() => {
      return () => {
        cleanUpTreeViewStore();
      };
    }, [cleanUpTreeViewStore]);

    return (
      <NodeList
        treeFlashListProps={treeFlashListProps}
        checkBoxViewStyleProps={checkBoxViewStyleProps}
        indentationMultiplier={indentationMultiplier}

        CheckboxComponent={CheckboxComponent}
        ExpandCollapseIconComponent={ExpandCollapseIconComponent}
        ExpandCollapseTouchableComponent={ExpandCollapseTouchableComponent}

        CustomNodeRowComponent={CustomNodeRowComponent}
      />
    );
  }
);

export const TreeView = React.memo(_TreeView);
