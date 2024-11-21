import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '~/stores/dataStore';
import { useList } from '~/composables/useList';
import Tag from '~/models/Tag';
import { useToolbar } from '~/composables/useToolbar';
import EmptyList from '~/components/general/empty-list';
import AppListSearch from '~/components/ui-kit/theme/app-list-search';
import { animateSwipeList } from '~/utils/AnimationUtils';

const TagsList = () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [list, setList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const onEvent = (event, payload) => {
    if (event === 'onPostDelete') {
      dataStore.tagList = dataStore.tagList.filter((item) => parseInt(item.id) !== parseInt(payload.id));
    }
  };

  const { onAdd, onEdit, onDelete } = useList({
    title: 'Tags list',
    routeList: '/tags/list',
    routeForm: '/tags/[id]',
    model: new Tag(),
    onEvent: onEvent,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dataStore.fetchTags();
      setIsLoading(false);
      setList(dataStore.tagListHierarchy);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (search.length === 0) {
      setFilteredList(list);
    } else {
      setFilteredList(
        list.filter((item) => Tag.getDisplayNameEllipsized(item).toUpperCase().indexOf(search.toUpperCase()) !== -1)
      );
    }
  }, [search, list]);

  const onRefresh = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    await dataStore.fetchTags();
    setIsLoading(false);
    setIsRefreshing(false);
    setList(dataStore.tagListHierarchy);
  };

  const onLoadMore = () => {
    setList(dataStore.tagListHierarchy);
  };

  const toolbar = useToolbar();
  toolbar.init({
    title: 'Tags list',
    backRoute: '/extras',
  });

  animateSwipeList(list);

  return (
    <div className={`app-form ${isEmpty ? 'empty' : ''}`}>
      <div className="app-top-toolbar">
        <div className="right">
          <button onClick={onAdd}>Add</button>
        </div>
      </div>

      {isEmpty && <EmptyList />}

      <div className="van-pull-refresh" onRefresh={onRefresh}>
        <div className="van-list p-1" finished={isFinished} onLoad={onLoadMore}>
          {isSearchVisible && list.length > 0 && <AppListSearch value={search} onChange={setSearch} />}

          {filteredList.map((item) => (
            <div key={item.id}>
              <TagListItem value={item} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsList;
