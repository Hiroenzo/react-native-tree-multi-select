import * as React from 'react';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import { debounce } from "lodash";
import {
  TreeView,
  type TreeViewRef
} from 'react-native-tree-multi-select';
import { sampleData3 } from './sample/sampleData3';
import SearchInput from './components/SearchInput';

export default function App() {
  const sampleData = React.useRef(sampleData3);
  const treeViewRef = React.useRef<TreeViewRef | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchText = React.useCallback(
    debounce((text) => treeViewRef.current?.setSearchText(text), 375, {
      leading: true,
      trailing: true,
      maxWait: 750
    }),
    []
  );

  const handleSelectionChange = (_checkedIds: string[]) => {
    // NOTE: Handle _checkedIds here
  };
  const handleExpanded = (_expandedIds: string[]) => {
    // NOTE: Handle _expandedIds here
  };

  const onSelectAllPress = () => treeViewRef.current?.selectAll?.();
  const onUnselectAllPress = () => treeViewRef.current?.unselectAll?.();
  const onSelectAllFilteredPress = () => treeViewRef.current?.selectAllFiltered?.();
  const onUnselectAllFilteredPress = () => treeViewRef.current?.unselectAllFiltered?.();

  return (
    <SafeAreaView
      style={styles.mainView}>
      <SearchInput onChange={debouncedSetSearchText} />
      <View
        style={styles.selectionButtonRow}>
        <Button
          title='Select All'
          onPress={onSelectAllPress} />
        <Button
          title='Unselect All'
          onPress={onUnselectAllPress} />
      </View>
      <View
        style={styles.selectionButtonRow}>
        <Button
          title='Select Filtered'
          onPress={onSelectAllFilteredPress} />
        <Button
          title='Unselect Filtered'
          onPress={onUnselectAllFilteredPress} />
      </View>

      <View
        style={[styles.selectionButtonRow, styles.selectionButtonBottom]}>
        <Button
          title='Expand All'
          onPress={() => {
            treeViewRef.current?.expandAll?.();
          }} />
        <Button
          title='Collapse All'
          onPress={() => {
            treeViewRef.current?.collapseAll?.();
          }} />
      </View>

      <View
        style={styles.treeViewParent}>
        <TreeView
          ref={treeViewRef}
          data={sampleData.current}
          onCheck={handleSelectionChange}
          onExpand={handleExpanded}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  selectionButtonRow: {
    borderTopWidth: 0.5,
    borderColor: "lightgrey",
    paddingVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  selectionButtonBottom: {
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  },
  treeViewParent: {
    flex: 1,
    minWidth: "100%"
  }
});
