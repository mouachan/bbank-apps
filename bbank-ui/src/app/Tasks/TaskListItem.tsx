import Moment from 'react-moment';
import React, { useContext } from 'react';
import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';

import TaskConsoleContext, {
  IContext
} from '../../../context/TaskConsoleContext/TaskConsoleContext';
import { GraphQL } from '@kogito-apps/common';
import UserTaskInstance = GraphQL.UserTaskInstance;
export namespace GraphQL {
  export type Maybe<T> = T | null;
  export type Exact<T extends { [key: string]: any }> = {
    [K in keyof T]: T[K];
  };
export type UserTaskInstance = {
  __typename?: 'UserTaskInstance';
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['String']>;
  processInstanceId: Scalars['String'];
  processId: Scalars['String'];
  rootProcessInstanceId?: Maybe<Scalars['String']>;
  rootProcessId?: Maybe<Scalars['String']>;
  state: Scalars['String'];
  actualOwner?: Maybe<Scalars['String']>;
  adminGroups?: Maybe<Array<Scalars['String']>>;
  adminUsers?: Maybe<Array<Scalars['String']>>;
  completed?: Maybe<Scalars['DateTime']>;
  started: Scalars['DateTime'];
  excludedUsers?: Maybe<Array<Scalars['String']>>;
  potentialGroups?: Maybe<Array<Scalars['String']>>;
  potentialUsers?: Maybe<Array<Scalars['String']>>;
  inputs?: Maybe<Scalars['String']>;
  outputs?: Maybe<Scalars['String']>;
  referenceName?: Maybe<Scalars['String']>;
  lastUpdate: Scalars['DateTime'];
  endpoint?: Maybe<Scalars['String']>;
};

export interface IOwnProps {
  id: number;
  userTaskInstanceData: UserTaskInstance;
}

const TaskListItem: React.FC<IOwnProps> = ({ userTaskInstanceData }) => {
  const context: IContext<UserTaskInstance> = useContext(TaskConsoleContext);

  return (
    <React.Fragment>
      <DataListItem aria-labelledby="kie-datalist-item">
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key={1}>{userTaskInstanceData.name}</DataListCell>,
              <DataListCell key={2}>
                {userTaskInstanceData.started ? (
                  <Moment fromNow>
                    {new Date(`${userTaskInstanceData.started}`)}
                  </Moment>
                ) : (
                  ''
                )}
              </DataListCell>,
              <DataListCell key={3}>
                {userTaskInstanceData.processId}
              </DataListCell>,
              <DataListCell key={4}>
                {userTaskInstanceData.processInstanceId}
              </DataListCell>,
              <DataListCell key={5}>{userTaskInstanceData.state}</DataListCell>
            ]}
          />

          <DataListAction
            aria-labelledby="kie-datalist-item kie-datalist-action"
            id="kie-datalist-action"
            aria-label="Actions"
          >
            <Link
              to={'/Task/' + userTaskInstanceData.id}
              onClick={() => {
                context.setActiveItem(userTaskInstanceData);
              }}
            >
              Open Task
            </Link>
          </DataListAction>
        </DataListItemRow>
      </DataListItem>
    </React.Fragment>
  );
};

export default TaskListItem;
