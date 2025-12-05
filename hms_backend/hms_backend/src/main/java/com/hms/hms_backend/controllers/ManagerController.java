package com.hms.hms_backend.controllers;

import com.hms.hms_backend.entity.Manager;
import com.hms.hms_backend.services.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

//    public ManagerController(ManagerService managerService) {
//        this.managerService = managerService;
//    }

    @GetMapping
    public List<Manager> getAllManagers() {
        return managerService.getAllManagers();
    }

    @GetMapping("/{id}")
    public Manager getManagerById(@PathVariable int id) {
        return managerService.getManagerById(id)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
    }

    @PostMapping
    public Manager createManager(@RequestBody Manager manager) {
        return managerService.createManager(manager);
    }

    @PutMapping("/{id}")
    public Manager updateManager(@PathVariable int id, @RequestBody Manager managerDetails) {
        return managerService.updateManager(id, managerDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteManager(@PathVariable int id) {
        managerService.deleteManager(id);
        return "Manager deleted successfully";
    }
}

