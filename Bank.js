// ==========================================
// 1. Transaction Class
// ==========================================
class Transaction {
    constructor(amount, date) {
        this.amount = amount;
        this.date = date;
    }
}

// ==========================================
// 2. Customer Class
// ==========================================
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
        // Calculate total balance from all transactions
        const total = this.transactions.reduce((sum, trans) => sum + trans.amount, 0);
        return total < 0 ? 0 : total; // Balance cannot be negative
    }

    addTransactions(amount) {
        // Validation: Ensure amount is a valid number
        if (typeof amount !== 'number' || isNaN(amount)) {
            return false;
        }

        // Prevent balance from going negative
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
// 3. Branch Class
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
        // Validation & check if customer already exists in this branch
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

// ==========================================
// 4. Bank Class
// ==========================================
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
// Running Test Code (AlInma, AlRajhi, AlAhli)
// ==========================================

// 1. Creating Banks (AlInma, AlRajhi, AlAhli)
const alInmaBank = new Bank("AlInma Bank");
const alRajhiBank = new Bank("AlRajhi Bank");
const alAhliBank = new Bank("AlAhli Bank");

// 2. Creating Branches
const gharbiBranch = new Branch("Al-Gharbi Branch");
const shurooqBranch = new Branch("Al-Shurooq Branch");
const olayaBranch = new Branch("Al-Olaya Branch");

// 3. Creating Customers (Arabic names written in English)
const customer1 = new Customer("Ahmad", 1);
const customer2 = new Customer("Sara", 2);
const customer3 = new Customer("Khaled", 3);

// 4. Adding Branches to AlInma Bank
alInmaBank.addBranch(gharbiBranch);
alInmaBank.addBranch(shurooqBranch);
alInmaBank.addBranch(gharbiBranch); // Duplicate check (returns false)

// 5. Searching Branches
console.log("Search 'Gharbi':", alInmaBank.findBranchByName("Gharbi"));
console.log("Search 'Shurooq':", alInmaBank.findBranchByName("Shurooq"));

// 6. Adding Customers to Branches
alInmaBank.addCustomer(gharbiBranch, customer1);
alInmaBank.addCustomer(gharbiBranch, customer3);
alInmaBank.addCustomer(shurooqBranch, customer1);
alInmaBank.addCustomer(shurooqBranch, customer2);

// 7. Adding Transactions
alInmaBank.addCustomerTransaction(gharbiBranch, customer1.getId(), 3000);
alInmaBank.addCustomerTransaction(gharbiBranch, customer1.getId(), 2000);
alInmaBank.addCustomerTransaction(gharbiBranch, customer2.getId(), 3000);

// 8. Testing Balance & Withdrawals
customer1.addTransactions(-1000);
console.log("\nAhmad's Balance:", customer1.getBalance());

// 9. Printing Customer Lists
alInmaBank.listCustomers(gharbiBranch, true);
alInmaBank.listCustomers(shurooqBranch, true);