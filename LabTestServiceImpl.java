package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.request.AddLabtestRequest;
import com.hms.hms_backend.dtos.request.UpdateLabtestRequest;
import com.hms.hms_backend.dtos.response.GetAllLabtestResponse;
import com.hms.hms_backend.entities.Labtest;
import com.hms.hms_backend.entities.Manager;
import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.services.LabtestService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

@Service
public class LabTestServiceImpl implements LabtestService {

    //Dao's
    private final LabtestDao labtestDao;
    private final ManagerDao managerDao;
    //Dao's Constructor
    public LabTestServiceImpl(LabtestDao labtestDao, ManagerDao managerDao) {
        this.labtestDao = labtestDao;
        this.managerDao = managerDao;
    }

    //Add the method of service interface

    @Override
    public void addLabtest(AddLabtestRequest request) {

        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Manager manager = managerDao.findByUserAccount(loggedInUser)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (request.getTestName() == null || request.getTestName().isBlank()) {
            throw new RuntimeException("Test name is required");
        }

        if (request.getLabTestFees() < 0) {
            throw new RuntimeException("Lab test fees cannot be negative");
        }

        if (request.getImage() == null || request.getImage().isEmpty()) {
            throw new RuntimeException("Labtest image is required");
        }

        MultipartFile image = request.getImage();
        String originalFileName = image.getOriginalFilename();

        // ✅ avoid null image name issue
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Invalid image file");
        }

        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        try {
            String uploadDir = "D:/Secret Project/hms_backend/hms_backend/src/main/java/com/hms/hms_backend/asset/labtest-images";

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File destination = new File(dir, fileName); // ✅ best way
            image.transferTo(destination);

            Labtest labtest = new Labtest();
            labtest.setTestName(request.getTestName());
            labtest.setDescription(request.getDescription());
            labtest.setImage(fileName);
            labtest.setLabTestFees(request.getLabTestFees());
            labtest.setManager(manager);
            labtest.setCreatedAt(LocalDate.now());

            labtestDao.save(labtest);

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }


    //This method for Getting All Labtest Response
    @Override
    public List<GetAllLabtestResponse> getAllLabtests() {
        return labtestDao.findAll().stream().map(test ->{
            GetAllLabtestResponse dto = new GetAllLabtestResponse();
            dto.setTestid(test.getTestid());
            dto.setTestName(test.getTestName());
            dto.setDescription(test.getDescription());
            dto.setImage(test.getImage());
            dto.setLabTestFees(test.getLabTestFees());
            return dto;
        }).toList();
    }

    //This method for Getting Latest Response by Test Name
    @Override
    public List<GetAllLabtestResponse> searchLabtestByName(String name) {
        return labtestDao.findByTestNameContainingIgnoreCase(name)
                .stream().map(test ->{
                    GetAllLabtestResponse dto = new GetAllLabtestResponse();
                    dto.setTestid(test.getTestid());
                    dto.setTestName(test.getTestName());
                    dto.setDescription(test.getDescription());
                    dto.setImage(test.getImage());
                    dto.setLabTestFees(test.getLabTestFees());
                    return dto;
                }).toList();
    }

    //Update Labtest By request of implementation

    @Override
    public void updateLabtest(int testId, UpdateLabtestRequest request) {

        Labtest labtest = labtestDao.findById(testId)
                .orElseThrow(() -> new RuntimeException("Lab test not found"));

        if ( request.getLabTestFees() != null && request.getLabTestFees() < 0) {
            throw new RuntimeException("Lab test fees cannot be negative");
        }

        if (request.getTestName() != null) {
            labtest.setTestName(request.getTestName());
        }

        if (request.getDescription() != null) {
            labtest.setDescription(request.getDescription());
        }

        if (request.getImage() != null) {
            labtest.setImage(request.getImage());
        }

        if (request.getLabTestFees() != null) {
            labtest.setLabTestFees(request.getLabTestFees());
        }

        labtestDao.save(labtest);
    }


    //Delete the Labtest Record
    @Override
    public void deleteLabtest(int testId) {

        Labtest labtest = labtestDao.findById(testId)
                .orElseThrow(() -> new RuntimeException("Lab test not found"));

        labtestDao.delete(labtest);
    }

}