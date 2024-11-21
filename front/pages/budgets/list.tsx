import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '~/stores/dataStore';
import { Budget } from '~/models/Budget';
import { AppTopToolbar, AppButtonListAdd, EmptyList, AppListSearch, BudgetListItem } from '~/components';
import { useList } from '~/composables/useList';
import { useToolbar } from '~/composables/useToolbar';
import { get } from 'lodash';
import { animateSwipeList } from '~/utils/AnimationUtils';

const BudgetsListPage: React.FC = () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);

  const { isLoading, isFinished, isRefreshing, list, isEmpty, onAdd, onEdit, onDelete } = useList({
    title: 'Budgets list',
    routeList: '/budgets/list',
    routeForm: '/budgets/[id]',
    model: new Budget(),
    onEvent: (event, payload) => {
      if (event === 'onPostDelete') {
        dataStore.budgetList = dataStore.budgetList.filter(item => parseInt(item.id) !== parseInt(payload.id));
      }
    },
  });

  const filteredList = list.filter(item => {
    if (search.length === 0) return true;
    return Budget.getDisplayName(item).toUpperCase().includes(search.toUpperCase());
  });

  const onRefresh = async () => {
    isLoading(true);
    isRefreshing(true);
    await dataStore.fetchBudgets();
    isLoading(false);
    isRefreshing(false);
    onLoadMore();
  };

  const onLoadMore = () => {
    list(dataStore.budgetList);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const toolbar = useToolbar();
  toolbar.init({
    title: 'Budgets list',
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
        {filteredList.map(budget => (
          <BudgetListItem key={budget.id} value={budget} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default BudgetsListPage;
