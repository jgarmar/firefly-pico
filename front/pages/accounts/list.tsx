import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '~/stores/dataStore';
import { Account } from '~/models/Account';
import { AppTopToolbar, AppButtonListAdd, EmptyList, AppListSearch, AccountListItem } from '~/components';
import { useList } from '~/composables/useList';
import { useToolbar } from '~/composables/useToolbar';
import { get } from 'lodash';
import { animateSwipeList } from '~/utils/AnimationUtils';

const AccountsListPage: React.FC = () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [visibleAccountTypes, setVisibleAccountTypes] = useState(Object.values(Account.types).map(account => account.name));

  const { isLoading, isFinished, isRefreshing, list, isEmpty, onAdd, onEdit, onDelete } = useList({
    title: 'Accounts list',
    routeList: '/accounts/list',
    routeForm: '/accounts/[id]',
    model: new Account(),
    onEvent: (event, payload) => {
      if (event === 'onPostDelete') {
        dataStore.accountList = dataStore.accountList.filter(item => parseInt(item.id) !== parseInt(payload.id));
      }
    },
  });

  const filteredList = list.filter(item => {
    if (search.length === 0) return true;
    return Account.getDisplayName(item).toUpperCase().includes(search.toUpperCase());
  });

  const accountsGroupList = Object.keys(filteredList.reduce((result, account) => {
    const type = get(Account.getType(account), 'name');
    result[type] = [...(result[type] ?? []), account];
    return result;
  }, {})).sort().map(typeName => ({
    typeName,
    accounts: filteredList.filter(account => get(Account.getType(account), 'name') === typeName),
  }));

  const onRefresh = async () => {
    isLoading(true);
    isRefreshing(true);
    await dataStore.fetchAccounts();
    isLoading(false);
    isRefreshing(false);
    onLoadMore();
  };

  const onLoadMore = () => {
    list(dataStore.accountList);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const toolbar = useToolbar();
  toolbar.init({
    title: 'Accounts list',
    titleIcon: 'account',
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
        {accountsGroupList.map(({ typeName, accounts }) => (
          <div key={typeName}>
            <h2>{typeName}</h2>
            {accounts.map(account => (
              <AccountListItem key={account.id} value={account} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsListPage;
