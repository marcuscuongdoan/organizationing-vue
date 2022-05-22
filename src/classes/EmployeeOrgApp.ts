/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable quotes */
import { Action } from "./Action";
import { Employee } from "./Employee";
import { IEmployeeOrgApp } from "./IEmployeeOrgApp";

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;

  /** Store the previous action */
  private previousAction: Action[];

  /** Store the next action */
  private redoAction: Action[];

  private isRedo = false;

  constructor(_ceo: Employee) {
    this.ceo = _ceo;
    this.previousAction = [];
    this.redoAction = [];
  }

  /** this private function is to find targeted employee and supervisor,
   *
   * in addition, the parent is taken to fulfill the moving request
   */
  private findEmployees(employee: Employee, employeeID: number, supervisorID: number) {
    let employeeResult: Employee | undefined;
    let supervisorResult: Employee | undefined;
    let oldSupervisor = this.ceo;

    // eslint-disable-next-line consistent-return
    function deepFirstSearch(emp: Employee, parent: Employee, empID: number, supID: number) {
      if (emp.uniqueId === empID) {
        employeeResult = emp;
        oldSupervisor = parent;
      }
      if (emp.uniqueId === supID) {
        supervisorResult = emp;
      }
      if (employeeResult && supervisorResult) {
        return true;
      }
      for (let i = 0; i < emp.subordinates.length; i += 1) {
        const result = deepFirstSearch(emp.subordinates[i], emp, empID, supID);
        if (result) return true;
      }
    }
    deepFirstSearch(employee, this.ceo, employeeID, supervisorID);
    return {
      employee: employeeResult,
      supervisor: supervisorResult,
      parent: oldSupervisor,
    };
  }

  /** Added condition to check because CEO is the main level of the company,
   * the position of CEO is fixed
   *
   * find Employee and Supervisor first, then moving later
   *
   * sorting to make the list beautiful. */
  move(employeeID: number, supervisorID: number) {
    console.log("move", employeeID, supervisorID);
    if (employeeID === this.ceo.uniqueId) {
      console.log("cannot move CEO!");
      return;
    }

    if (employeeID === supervisorID) {
      console.log("cannot assign to self.");
      return;
    }

    const result = this.findEmployees(this.ceo, employeeID, supervisorID);
    const { employee, supervisor, parent } = result;
    if (!employee || !supervisor || !parent) {
      console.log("Cannot move");
    } else {
      const movedChildren = employee.subordinates;
      /** store the action and its' revert version */
      this.previousAction.push({
        revert: () => this.revertMove(employee, supervisor, parent, movedChildren),
        action: () => this.move(employeeID, supervisorID),
      });
      if (!this.isRedo) this.redoAction = [];

      /** reposition part */
      parent.subordinates = parent.subordinates.filter((sub) => sub.uniqueId !== employeeID);
      parent.subordinates = parent.subordinates.concat(employee.subordinates);
      parent.subordinates.sort((a, b) => a.uniqueId - b.uniqueId);
      employee.subordinates = [];
      supervisor.subordinates.push(employee);
      supervisor.subordinates.sort((a, b) => a.uniqueId - b.uniqueId);
    }
  }

  /** Instead of taking state to store the previous state,
   * I use the Command design pattern to revert the action here
   *
   * It takes some step to move back to the previous state,
   * by repositioning the employee, supervisor, its' parent and its' children
   */
  // eslint-disable-next-line class-methods-use-this
  private revertMove(
    employee: Employee,
    supervisor: Employee,
    parent: Employee,
    movedChildren: Employee[]
  ) {
    supervisor.subordinates = supervisor.subordinates.filter(
      (sub) => sub.uniqueId !== employee.uniqueId
    );
    parent.subordinates = parent.subordinates.filter(
      (sub) =>
        sub.uniqueId !== movedChildren.find((child) => child.uniqueId === sub.uniqueId)?.uniqueId
    );
    employee.subordinates = movedChildren;
    parent.subordinates = parent.subordinates.concat(employee);
    parent.subordinates.sort((a, b) => a.uniqueId - b.uniqueId);
  }

  /** use the stored revert action and the moving action also, you can see in move() */
  undo() {
    const prev = this.previousAction.pop();
    if (prev && prev.revert) {
      prev.revert();
      this.redoAction.push(prev);
    }
  }

  /** similar to undo but in the opposite way */
  redo() {
    console.log(this.redoAction);
    const next = this.redoAction.pop();
    if (next && next.action) {
      this.isRedo = true;
      next.action();
      this.isRedo = false;
      this.previousAction.push(next);
    }
  }
}

export default EmployeeOrgApp;
