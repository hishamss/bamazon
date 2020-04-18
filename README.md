# Bamazon(Amazon-Like)

Bamazon is Amazon-like store with MySQL database. it takes orders from customer and updates the store inventory. The store manager also able to manager his store and the supervisor can view and manage the departmens through the manager and supervisor apps.

- BamazonCustomer: through this app the customer is able to view the items on sale then he can place an order.

  - the following video shows how this app runs
    ![Bamazoncustomer](/videos/customer1.gif)
  - If the customer wants to buy quantity more than what is available.
    ![Insuffecient quantity](/videos/customer2.gif)
  - Out of stock: if the customer wants to buy 0 quantity itme
    ![out of stock](/videos/customer3.gif)

- BamazonManager: the store manager can do the following through this app:

  - View Products for Sale: view avaialbe items for sale
    ![View items for sale](/videos/customer4.gif)
  - View low inventory: view items with quantity less than 5
    ![View low inventory](/videos/customer5.gif)
  - Add to inventory: manager can add more qunaitity of specific item
    ![Add to inventory](/videos/customer7.gif)
  - Add New product: the manager can add new item under specific department. the app will display all available departments for the mananger.
    ![Add new Item](/videos/customer6.gif)

- BamazonSupervisor: the user can display a summarized table for sales by departments. Supervisor can do the following:
  - View Product Sales by Department
    ![Summarized table](/videos/customer8.gif)
  - Create new department
  - View all created departments
    ![Create & View](/videos/customer9.gif)
