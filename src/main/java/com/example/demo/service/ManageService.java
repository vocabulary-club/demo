package com.example.demo.service;

import com.example.demo.repository.ManageRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ManageService {

    private final ManageRepository manageRepository;

    public ManageService(ManageRepository manageRepository) {
        this.manageRepository = manageRepository;
    }

    public Object create(Map<String, Object> data) {

        int nEngId = manageRepository.createVocEng(data);
        int nMonId = manageRepository.createVocMon(data);
        if(nEngId == 1 && nMonId == 1) {
            return manageRepository.createVocDic(data);
        }
        return 0;
    }

    public Object update(Map<String, Object> data) {

        int nEngId = manageRepository.updateVocEng(data);
        int nMonId = manageRepository.updateVocMon(data);

        return 0;
    }

    public Object delete(Map<String, Object> data) {

        int nDicId = manageRepository.deleteVocDic(data);
        int nEngId = manageRepository.deleteVocEng(data);
        int nMonId = manageRepository.deleteVocMon(data);

        return 0;
    }

    public Object select() {
        return manageRepository.select();
    }
}
