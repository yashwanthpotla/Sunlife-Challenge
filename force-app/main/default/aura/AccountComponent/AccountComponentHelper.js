({
    getAccounts : function(component,event,helper) {
        let action = component.get('c.GetAccounts');
        action.setCallback(this,(response) => {
            if (response.getState() == 'SUCCESS') {
            helper.setUpTable(component,helper,response.getReturnValue());
            let spinner = component.find("mySpinner");
        	$A.util.addClass(spinner, "slds-hide");
        }
                           });
        $A.enqueueAction(action);
    },
    setUpTable : function (component,helper,lst_Account) {
        var table = new Tabulator("#accountTable", {
                data:lst_Account,           //load row data from array
                layout:"fitColumns",      //fit columns to width of table
                responsiveLayout:"hide",  //hide columns that dont fit on the table
                tooltips:true,            //show tool tips on cells
                addRowPos:"top",          //when adding a new row, add it to the top of the table
                history:true,             //allow undo and redo actions on the table
                pagination:"local",       //paginate the data
                paginationSize:7,         //allow 7 rows per page of data
                movableColumns:true,      //allow column order to be changed
                resizableRows:true,       //allow row order to be changed
                cellEdited:function(cell){
      				 let cellValue = cell.getValue();
        			 let data = cell.getData();
                     let spinner = component.find("mySpinner");
        			 $A.util.removeClass(spinner, "slds-hide");
                     helper.updateAccount(component,helper,cell.getData());
    			},
                initialSort:[             //set the initial sort order of the data
                    {column:"Name", dir:"asc"},
                ],
                    columns:[                 //define the table columns
                    {title:"Name", field:"Name", editor:"input",headerFilter:true,
                        formatter: function (cell, formatterParams) {
                            return helper.associationFormatter(cell, formatterParams);
                        }
                    },
                    {title:"Account Owner", field:"Owner.Name"},
                    {title:"Phone", field:"Phone",editor:"input"},
                    {title:"Website", field:"Website",editor:"input"},
                    {title:"Annual Revenue", field:"AnnualRevenue", editor:"input"},
                 ],
            });
        
        if (lst_Account && lst_Account.length > 0) {
            table.replaceData(lst_Account);
        } 
    },
    associationFormatter: function (cell, formatterParams) {
        let cellValue = cell.getValue();
        let data = cell.getData();
        let result = "<a target='blank' href='/" + data.Id + "'>" + data.Name + "</a>";
                  
        return result;
    },
    updateAccount : function (component,helper,account) {
        let action = component.get('c.updateAccount');
        action.setParams({
            json_Account :  JSON.stringify(account),
        });
        action.setCallback(this,(response) =>{
            if (response.getState() == 'SUCCESS') {
            	let status = response.getReturnValue();
             let spinner = component.find("mySpinner");
        	     $A.util.addClass(spinner, "slds-hide");
                if (status != 'Updated')  {
                    helper.showToast('Error','Account not updated','error');
            	}
                else {
                         helper.showToast('Success','Account updated','success')
                 }
            	
        	}
        });
        $A.enqueueAction(action);
    },
        
     showToast : function(toastTitle, toastMessage, toastType) {
        let toastParams = {
            title: toastTitle,
            message: toastMessage,
            type: toastType
        };
        let toastEvent = $A.get("e.force:showToast");
        if(toastEvent) {
            toastEvent.setParams(toastParams);
            toastEvent.fire();
        }
    },
})