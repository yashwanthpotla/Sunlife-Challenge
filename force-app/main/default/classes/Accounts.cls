public with sharing class Accounts {

    @AuraEnabled
    public static List<Account> GetAccounts() {
        List<Account> lst_Account = new List<Account>();
        try {
            lst_Account = [Select Id,Name,Owner.Name,Phone,Website,AnnualRevenue From Account Where Industry = 'Financial Services'];
        }
        catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        return lst_Account;
    }
    
    @AuraEnabled
    public static string updateAccount(string json_Account) {
        string status = 'Not Updated';
        if (String.isNotBlank(json_Account)) {
            Account acc = (Account)Json.deserialize(json_Account, Account.class);
            if (Schema.sObjectType.Account.isUpdateable()) {
   			   update acc;
               status = 'Updated';
			}
        }
        return status;
    }
    
}