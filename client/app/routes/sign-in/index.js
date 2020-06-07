import LogoUrl from '../../layout/logo/logo.jpg';
import { LabelsTopLayout } from 'cx/ui';
import { TextField, PrivateStore, Button, ValidationGroup } from 'cx/widgets';
import Controller from './Controller';
import '../../components/theme/fields';

export default (
   <cx>
      <div class="w-full h-full flex items-center justify-center -mt-10 bg-gray-200">
         <div style="width: 350px">
            <div class="flex justify-center mb-4">
               <img src={LogoUrl} alt="logo" class="h-14" />
            </div>
            <div class="border-2 rounded-lg pt-8 pb-10 px-8 bg-white">
               <p class="mb-2">Sign in to Kitchen Sink</p>
               <PrivateStore data={{ user: { bind: 'user' } }}>
                  <ValidationGroup invalid-bind="invalid" visited-bind="visited" controller={Controller}>
                     <LabelsTopLayout columns={1} mod="stretch">
                        <TextField label="Email" value-bind="email" class="w-full" required />
                        <TextField
                           label="Password"
                           value-bind="password"
                           class="w-full"
                           required
                           inputType="password"
                        />
                        <Button mod="primary" class="w-full mt-4" onClick="onSignIn">
                           Sign In
                        </Button>
                     </LabelsTopLayout>
                  </ValidationGroup>
               </PrivateStore>
            </div>
         </div>
      </div>
   </cx>
);
