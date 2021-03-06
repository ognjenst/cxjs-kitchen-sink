import { expr, LabelsLeftLayout, computable } from 'cx/ui';
import { Button, FieldGroup, PrivateStore, TextArea, TextField, Sandbox, NumberField, UploadButton } from 'cx/widgets';
import { AsyncButton } from '../../../../components/AsyncButton';
import { createRowEditorRecord } from '../../../../components/swiss-army-grid/RowEditor';
import { SwissArmyGrid } from '../../../../components/swiss-army-grid/SwissArmyGrid';
import Controller from './Controller';
import { LoadingMask } from '../../../../components/LoadingMask';
import { showErrorToast, showSuccessToast } from '../../../../components/toasts';

export default (
   <cx>
      <Sandbox key-bind="$page.selection" storage-bind="$page.dummy" recordAlias="$ledger">
         <PrivateStore data={{ id: { bind: '$page.selection' } }} controller={Controller}>
            <LoadingMask
               class="flex-grow-100 border-r px-4 py-2 flex flex-col"
               style="max-width: 850px; min-height: 0"
               status-bind="status"
               errorMessage-bind="error"
            >
               <div class="flex border-b p-4">
                  <div class="w-48">
                     <div class="">Ledger</div>
                     <p class="text-xs text-gray-600"></p>
                  </div>
                  <div>
                     <FieldGroup invalid-bind="invalid" visited-bind="visited">
                        <LabelsLeftLayout>
                           <TextField
                              value-bind="data.name"
                              label="Name"
                              required
                              autoFocus-expr="{id} == 'new'"
                              class="w-64"
                           />
                           <NumberField value-bind="data.year" label="Year" required class="w-64" format="s" />
                           <TextArea value-bind="data.description" label="Description" rows={4} style="width: 400px" />
                        </LabelsLeftLayout>
                     </FieldGroup>
                  </div>
               </div>

               <div class="flex items-center px-4 py-4">
                  <div class="">Accounts</div>
                  <Button
                     class="ml-4"
                     mod="hollow"
                     icon="fa-plus"
                     onClick={(e, { store }) => {
                        store.update('data.accounts', (accounts) => [createRowEditorRecord({}), ...(accounts || [])]);
                     }}
                  >
                     Add
                  </Button>
                  <a
                     mod="hollow"
                     baseClass="button"
                     href-tpl="~/api/ledgers/{id}/accounts/csv"
                     target="_blank"
                     class="ml-auto"
                  >
                     Export
                  </a>
                  <UploadButton
                     mod="hollow"
                     url-tpl="~/api/ledgers/{id}/accounts/csv"
                     onUploadStarting={(e, { store }) => {
                        store.set('status', 'loading');
                     }}
                     onUploadComplete={(e, { controller }) => {
                        showSuccessToast('Accounts have been successfully imported.');
                        controller.onLoad();
                     }}
                     onUploadError={(e, { store }) => {
                        showErrorToast('Upload failed.');
                        console.log(e);
                        store.set('status', 'ok');
                     }}
                  >
                     Import
                  </UploadButton>
               </div>

               <SwissArmyGrid
                  border={false}
                  records-bind="data.accounts"
                  rowEditable
                  scrollable
                  buffered
                  style="flex-basis: 200px;"
                  sortField="code"
                  sortDirection="ASC"
                  class="flex-grow mx-2"
                  mod={['condensed', 'ellipsis']}
                  columns={[
                     {
                        field: 'code',
                        header: { text: 'Code', style: 'border-left-color: #ddd' },
                        editor: true,
                        required: true,
                        width: 70,
                        style: {
                           paddingLeft: computable('$record.code', (code) => (code ? code.length * 5 : 0)),
                        },
                     },
                     { field: 'description', header: 'Description', editor: true, required: true, width: 400 },
                     { field: 'by_party', header: 'Party', type: 'boolean', editor: true, width: 60 },
                     {
                        field: 'entries_allowed',
                        header: 'Entry',
                        type: 'boolean',
                        editor: true,
                        width: 60,
                     },
                  ]}
                  onDeleteRecord={(e, { store }) => {
                     store.delete('$record');
                  }}
                  row={{
                     className: {
                        'line-through text-gray-600': expr("{$record.__status} == 'deleted'"),
                     },
                  }}
               />

               <div class="px-4 py-5 text-right border-t">
                  <Button
                     onClick={(e, { store }) => {
                        store.set('visible', false);
                     }}
                  >
                     Cancel
                  </Button>
                  <AsyncButton class="ml-2" mod="primary" onClick="onSave">
                     Save
                  </AsyncButton>
               </div>
            </LoadingMask>
         </PrivateStore>
      </Sandbox>
   </cx>
);
