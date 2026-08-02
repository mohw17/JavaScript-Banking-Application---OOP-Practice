

class Transaction {
    constructor(amount, date) {
        this.amount = amount;
        this.date = date;
    }
}




class Customer {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.transactions = [];
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getTransactions() {
        return this.transactions;
    }

    getBalance() {

        const total = this.transactions.reduce((sum, trans) => sum + trans.amount, 0);
        return total < 0 ? 0 : total; 
    }

    addTransactions(amount) {


        if (typeof amount !== 'number' || isNaN(amount)) {
            return false;
        }


        const currentBalance = this.getBalance();
        if (currentBalance + amount < 0) {
            console.log(`Transaction failed for ${this.name}: Insufficient funds.`);
            return false;
        }

        const newTransaction = new Transaction(amount, new Date());
        this.transactions.push(newTransaction);
        return true;
    }
}

// ==========================================

class Branch {
    constructor(name) {
        this.name = name;
        this.customers = [];
    }

    getName() {
        return this.name;
    }

    getCustomers() {
        return this.customers;
    }

    addCustomer(customer) {


        if (!customer || !(customer instanceof Customer)) return false;
        
        const exists = this.customers.some(c => c.getId() === customer.getId());
        if (!exists) {
            this.customers.push(customer);
            return true;
        }
        return false;
    }

    addCustomerTransaction(customerId, amount) {
        const customer = this.customers.find(c => c.getId() === customerId);
        if (customer) {
            return customer.addTransactions(amount);
        }
        return false;
    }
}


class Bank {
    constructor(name) {
        this.name = name;
        this.branches = [];
    }

    checkBranch(branch) {
        if (!branch || !(branch instanceof Branch)) return false;
        return this.branches.includes(branch);
    }

    addBranch(branch) {
        if (!branch || !(branch instanceof Branch)) return false;
        if (!this.checkBranch(branch)) {
            this.branches.push(branch);
            return true;
        }
        return false;
    }

    addCustomer(branch, customer) {
        if (this.checkBranch(branch)) {
            return branch.addCustomer(customer);
        }
        return false;
    }

    addCustomerTransaction(branch, customerId, amount) {
        if (this.checkBranch(branch)) {
            return branch.addCustomerTransaction(customerId, amount);
        }
        return false;
    }

    findBranchByName(branchName) {
        if (!branchName || typeof branchName !== 'string') return null;
        
        const matches = this.branches.filter(b => 
            b.getName().toLowerCase().includes(branchName.toLowerCase())
        );
        return matches.length > 0 ? matches : null;
    }

    listCustomers(branch, includeTransactions) {
        if (!this.checkBranch(branch)) {
            console.log("Branch does not belong to this bank.");
            return;
        }

        console.log(`\n--- Customers List for Branch: ${branch.getName()} (${this.name} Bank) ---`);
        const customers = branch.getCustomers();

        customers.forEach(customer => {
            console.log(`Customer: ${customer.getName()} (ID: ${customer.getId()})`);
            if (includeTransactions) {
                console.log("Transactions:");
                customer.getTransactions().forEach(t => {
                    console.log(`  - Amount: $${t.amount} | Date: ${t.date}`);
                });
            }
        });
    }
}


// ==========================================


const alInmaBank = new Bank("AlInma Bank");
const alRajhiBank = new Bank("AlRajhi Bank");
const alAhliBank = new Bank("AlAhli Bank");



const gharbiBranch = new Branch("Al-Gharbi Branch");
const shurooqBranch = new Branch("Al-Shurooq Branch");
const olayaBranch = new Branch("Al-Olaya Branch");



const customer1 = new Customer("Ahmad", 1);
const customer2 = new Customer("Sara", 2);
const customer3 = new Customer("Khaled", 3);


alInmaBank.addBranch(gharbiBranch);
alInmaBank.addBranch(shurooqBranch);
alInmaBank.addBranch(gharbiBranch);
console.log("Search 'Gharbi':", alInmaBank.findBranchByName("Gharbi"));
console.log("Search 'Shurooq':", alInmaBank.findBranchByName("Shurooq"));


alInmaBank.addCustomer(gharbiBranch, customer1);
alInmaBank.addCustomer(gharbiBranch, customer3);
alInmaBank.addCustomer(shurooqBranch, customer1);
alInmaBank.addCustomer(shurooqBranch, customer2);


alInmaBank.addCustomerTransaction(gharbiBranch, customer1.getId(), 3000);
alInmaBank.addCustomerTransaction(gharbiBranch, customer1.getId(), 2000);
alInmaBank.addCustomerTransaction(gharbiBranch, customer2.getId(), 3000);


customer1.addTransactions(-1000);
console.log("\nAhmad's Balance:", customer1.getBalance());


alInmaBank.listCustomers(gharbiBranch, true);
alInmaBank.listCustomers(shurooqBranch, true);