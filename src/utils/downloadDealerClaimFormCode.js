import dealerClaimFormPageSource from '../Pages/ClaimFormFormPage.jsx?raw';
import dealerClaimFormApiSource from '../services/claimFormUser.js?raw';

const DEALER_CLAIM_FORM_LOGIC = `DEALER CLAIM FORM LOGIC
=======================
This is the dealer claim form used at /claim-form when the logged-in user
is not admin (ClaimFormFormPage). Admin can download this file from the
admin claim form only. Dealer and dealer-user screens are unchanged.

FLOW
----
1. Dealer ID and dealer name come from the logged-in user and are read-only.
2. Type of Claim (bid | fleet) loads manufacturers from
   GET /dealer/get-dealer-rebate-type?rebate_type={type}.
   Dealer claim form keeps only RedMax products.
3. Manufacturer loads models from
   GET /dealer/get-models-claims?product_id={id}.
4. Selecting a model loads serials from
   GET /dealer/get-serials-claims?model_number={modelNumber}.
   Serials already used on other rows are hidden.
5. Model + serial are verified with
   POST /dealer/verify-claim-serial-number
   { model_number, serial_number }.
   Response fills model_serial, part_number, points, msrp.
6. Sell price is computed as: MSRP - Discount Rate.
7. Submit posts multipart data to POST /dealer/submit-claim.

PRICE / REBATE LOGIC (calculatePrice)
-------------------------------------
discountDollar = msrp - sellPrice
discountPercentage = (1 - sellPrice / msrp) * 100

If manufacturer is Little Wonder, Classen, or Mantis:
  < 10%   -> dealerRebate = 0
  10-15%  -> dealerRebate = discountPercentage * 7
  15-20%  -> dealerRebate = discountPercentage * 8.5
  >= 20%  -> dealerRebate = discountPercentage * 10

Otherwise (including RedMax):
  10-20%  -> dealerRebate = discountDollar / 2
  >= 20%  -> dealerRebate = msrp * 0.1
  < 10%   -> dealerRebate = discountDollar

Total on submit is the sum of all row dealerRebate values (getTotalMsrp).

SOURCE FILES
------------
The rest of this download is the live dealer claim form page and API service.
`;

const downloadBlob = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadDealerClaimFormCode = () => {
  const content = [
    DEALER_CLAIM_FORM_LOGIC,
    '',
    '========== src/Pages/ClaimFormFormPage.jsx ==========',
    dealerClaimFormPageSource,
    '',
    '========== src/services/claimFormUser.js ==========',
    dealerClaimFormApiSource,
  ].join('\n');

  downloadBlob(content, 'DealerClaimFormCode.txt');
};
