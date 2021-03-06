wesabe.provide('fi-scripts.com.ingdirect.transfers', {
  dispatch: function() {
    if (job.goal !== 'transfer')
      return;

    if (!page.present(e.transfers.indicator)) {
      if (page.present(e.transfers.tabLink)) {
        action.goTransfersPage();
      } else {
        return;
      }
    }

    if (page.present(e.transfers.confirmation.indicator)) {
      job.succeed();
      action.logoff();
    } else if (page.present(e.transfers.form.errors.validationFailed)) {
      job.fail('transfer.invalid');
    } else if (page.present(e.transfers.form.errors.general)) {
      job.fail('transfer.error');
    } else if (page.present(e.transfers.verification.continueButton)) {
      action.confirmTransfer();
    } else if (page.present(e.transfers.form.continueButton)) {
      action.fillTransferForm();
    }
  },

  actions: {
    goTransfersPage: function() {
      page.click(e.transfers.tabLink);
    },

    fillTransferForm: function() {
      var transfer = job.options.transfer;

      if (!transfer || !transfer.source || !transfer.destination || !transfer.amount) {
        wesabe.error("Some transfer data was missing (requires 'source', 'destination', and 'amount'), given:", wesabe.taint(transfer));
        return;
      }

      job.update('transfer');
      page.fill(e.transfers.form.sourceAccountNumber, transfer.source);
      page.fill(e.transfers.form.destinationAccountNumber, transfer.destination);
      page.fill(e.transfers.form.amount, transfer.amount);

      if (transfer.memo)
        page.fill(e.transfers.form.memo, transfer.memo);

      page.click(e.transfers.form.continueButton);
    },

    confirmTransfer: function() {
      page.click(e.transfers.verification.continueButton);
    },
  },

  elements: {
    transfers: {
      indicator: [
        '//h1[contains(string(.), "Transfer Money")]',
      ],

      tabLink: [
        '//a[@title="Transfer Money"]',
        '//a[contains(@href, "money_transfer")][contains(string(.), "Transfer Money")]',
      ],

      form: {
        typeDeposit: [
          '//input[@type="radio"][@name="transferTypeSelector"][@value="DepositTransfer"]',
        ],

        amount: [
          '//input[@type="text"][@name="amount"]',
        ],

        sourceAccountNumber: [
          '//select[@name="sourceAccountNumber"]',
        ],

        destinationAccountNumber: [
          '//select[@name="destinationAccountNumber"]',
        ],

        memo: [
          '//input[@type="text"][@name="depositTransferMemo"]',
        ],

        frequency: {
          now: {
            option: [
              '//input[@type="radio"][@name="depositTransferType"][@value="NOW"]',
            ],
          },

          scheduled: {
            option: [
              '//input[@type="radio"][@name="depositTransferType"][@value="SCHEDULED"]',
            ],

            date: [
              '//input[@type="text"][@name="scheduleDate"]',
            ],
          },

          recurring: {
            option: [
              '//input[@type="radio"][@name="depositTransferType"][@value="RECURRING"]',
            ],

            frequencies: {
              select: [
                '//select[@name="recurringFrequency"]',
              ],

              weekly: [
                './/option[@value="WEEKLY"]',
              ],

              biweekly: [
                './/option[@value="BIWEEKLY"]',
              ],

              twiceMonthly: [
                './/option[@value="TWICEMONTHLY"]',
              ],

              monthly: [
                './/option[@value="MONTHLY"]',
              ],
            },

            startDate: [
              '//input[@type="text"][@name="recurringStartDate"]',
            ],

            endDate: [
              '//input[@type="text"][@name="recurringEndDate"]',
            ],
          },
        },

        continueButton: [
          '//a[@onclick][contains(string(.), "Continue")]',
        ],

        errors: {
          general: [
            '//div[contains(@class, "alert")][contains(@class, "stop")]',
          ],

          validationFailed: [
            '//div[contains(string(.), "Please review the items marked in red below.")]',
          ],

          shareBuilderUnavailable: [
            '//*[contains(string(.), "Nightly update in progress.")]',
          ],
        },
      },

      verification: {
        continueButton: [
          '//a[@onclick][contains(string(.), "Accept")]',
        ],
      },

      confirmation: {
        indicator: [
          '//h1[contains(string(.), "Transfer Money - Confirmation")]',
          '//*[contains(string(.), "You\'ve successfully submitted your transfer.")]',
        ],
      },
    },
  },
});
