- Role based
    + User
        - ADMIN
        - DEPARTMENT_HEAD
        - MANAGER
        - OPERATOR(https://resources.workable.com/machine-operator-job-description)

- Departments 
    + Procurement Dept. (Responsible for acquiring RAW materials)
    + Manufacturing Dept. (Responsible for manufacturing products)
    + Sales Dept. (Responsible for making sales)

- Authorization / Authentication


##### Workflow
1. Procurement Dept. will handle the acquiring of raw materials, and will be managed by the department head.
   - Records will be stored about:
     - Getting the raw materials from source
     - Lending the raw materials to manufacturing department
     - lending machinery to manufacturing dept.

2. The Raw materials will be then consumed by Manufacturing Dept. to make actual products.
    - Records will be stored for:
      - Amount of Raw material consumed by a machine to produce a specific product
      - Batches will be created for each production
      - States of the machines will be stored. (Running, Idle)

3. The Products then will be sold by the sales Department.
    - Only the sales record will be stored.
  

# Q & A

Should the machine's state be handled by Backend in DB?
Should Manager's management be a responsibility of this app?
What Are the responsibilities of the roles assigned in this app?
