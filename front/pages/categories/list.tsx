import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '~/stores/dataStore';
import { Category } from '~/models/Category';
import { AppTopToolbar, AppButtonListAdd, EmptyList, AppListSearch, CategoryListItem } from '~/components';
import { useList } from '~/composables/useList';
import { useToolbar } from '~/composables/useToolbar';
import { get } from 'lodash';
import { animateSwipeList } from '~/utils/AnimationUtils';

const CategoriesListPage: React.FC = () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);

  const { isLoading, isFinished, isRefreshing, list, isEmpty, onAdd, onEdit, onDelete } = useList({
    title: 'Categories list',
    routeList: '/categories/list',
    routeForm: '/categories/[id]',
    model: new Category(),
    onEvent: (event, payload) => {
      if (event === 'onPostDelete') {
        dataStore.categoryList = dataStore.categoryList.filter(item => parseInt(item.id) !== parseInt(payload.id));
      }
    },
  });

  const filteredList = list.filter(item => {
    if (search.length === 0) return true;
    return Category.getDisplayName(item).toUpperCase().includes(search.toUpperCase());
  });

  const onRefresh = async () => {
    isLoading(true);
    isRefreshing(true);
    await dataStore.fetchCategories();
    isLoading(false);
    isRefreshing(false);
    onLoadMore();
  };

  const onLoadMore = () => {
    list(dataStore.categoryList);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const toolbar = useToolbar();
  toolbar.init({
    title: 'Categories list',
    backRoute: '/extras',
  });

  animateSwipeList(list);

  return (
    <div className={`app-form ${isEmpty ? 'empty' : ''}`}>
      <AppTopToolbar>
        <AppButtonListAdd onClick={onAdd} />
      </AppTopToolbar>

      {isEmpty && <EmptyList />}

      <div className="p-1">
        {isSearchVisible && list.length > 0 && <AppListSearch value={search} onChange={setSearch} />}
        {filteredList.map(category => (
          <CategoryListItem key={category.id} value={category} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesListPage;
