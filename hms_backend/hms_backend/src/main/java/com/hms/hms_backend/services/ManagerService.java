package com.hms.hms_backend.services;

import com.hms.hms_backend.entity.Manager;
import com.hms.hms_backend.repo.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ManagerService {

    @Autowired
    private ManagerRepository managerRepository;

//    public ManagerService(ManagerRepository managerRepository) {
//        this.managerRepository = managerRepository;
//    }

    public List<Manager> getAllManagers() {
        return managerRepository.findAll();
    }

    public Optional<Manager> getManagerById(int id) {
        return managerRepository.findById(id);
    }

    public Manager createManager(Manager manager) {
        return managerRepository.save(manager);
    }

    public Manager updateManager(int id, Manager managerDetails) {
        return managerRepository.findById(id).map(manager -> {
            manager.setName(managerDetails.getName());
            manager.setMobile(managerDetails.getMobile());
            manager.setEmail(managerDetails.getEmail());
           // manager.setUser(managerDetails.getUser());
            return managerRepository.save(manager);
        }).orElseThrow(() -> new RuntimeException("Manager not found"));
    }

    public void deleteManager(int id) {
        managerRepository.deleteById(id);
    }
}
